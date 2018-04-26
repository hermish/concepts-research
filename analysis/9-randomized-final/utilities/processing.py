import json
import itertools

THRESHOLD = 240.9
ALL_JUDGMENTS = [0, 1, 2, 3, 4, 5, 6]

def get_all_labels(num_questions):
    """
    :param num_questions: (int) the number of questions
    :return: [str], a lists list to the low and high question
        columns name prefixes in order
    """
    high_question_labels = ['high_q{}'.format(num) for
                            num in range(num_questions // 2)]
    low_question_labels = ['low_q{}'.format(num) for
                           num in range(num_questions // 2)]
    return low_question_labels + high_question_labels


def get_judgment_labels(num_judgments):
    """
    :param num_judgments: (int) the number of num_judgments
    :return: [str], a list of all the judgment suffixes in columns names
    """
    return ['j{}'.format(num) for num in range(num_judgments)]


def get_col_labels(num_questions, num_judgments):
    """
    :param num_questions: (int) the number of questions
    :param num_judgments: (int) the number of responses
    :return: (gen) a generator yielding strings for column names
    """
    yield from ('consent', 'participant_id', 'group_number', 'response_type',
                'test_one', 'test_two')
    for q_num in range(num_questions // 2):
        yield from ('low_q{}_score'.format(q_num),
                    'low_q{}_index'.format(q_num),
                    'low_q{}_choice'.format(q_num))
        for j_num in range(num_judgments):
            yield 'low_q{}_j{}'.format(q_num, j_num)
    for q_num in range(num_questions // 2):
        yield from ('high_q{}_score'.format(q_num),
                    'high_q{}_index'.format(q_num),
                    'high_q{}_choice'.format(q_num))
        for j_num in range(num_judgments):
            yield 'high_q{}_j{}'.format(q_num, j_num)


def fill_experiment_data(data, master_responses):
    """
    :param data: (dict) a structured dictionary with lists as values which will
        be updated
    :param master_responses: [dict] list of responses to the survey
    :return: (None) the dictionary data is mutated
    """
    for person in master_responses:
        responses = person['data']
        if _completed(responses):
            _fill_completed_data(responses, data)
        else:
            _fill_view_data(responses, data)


def _fill_completed_data(responses, data):
    """
    :param responses: [dict] the data corresponding to a completed entry
    :param data: (dict) the structured dictionary to be updated
    :return: (None) updates the dictionary with response data
    """
    first_entry = responses[0]
    judgment_indices = first_entry['judgmentIndices']
    question_indices = first_entry['questionIndices']
    question_scores = first_entry['questionScores']
    question_labels = _get_question_labels(question_scores)

    # General information
    data['response_type'].append(first_entry['responseType'])
    data['participant_id'].append(first_entry['participantID'])
    data['group_number'].append(first_entry['groupNumber'])

    # Scores and indices of questions
    for label, score, index in zip(question_labels, question_scores,
                                   question_indices):
        data['{}_score'.format(label)].append(score)
        data['{}_index'.format(label)].append(index)

    # Consent information
    consent_answer = json.loads(first_entry['responses'])
    consent_value = int(consent_answer['Q0'].startswith('I consent'))
    data['consent'].append(consent_value)

    # Omitted judgements
    for j_label in ALL_JUDGMENTS:
        if j_label not in judgment_indices:
            for q_label in question_labels:
                data['{}_j{}'.format(q_label, j_label)].append(None)

    # Test responses
    test_one_response = json.loads(responses[4]['responses'])
    test_two_response = json.loads(responses[16]['responses'])
    test_one_value = int(test_one_response['Q0'].startswith('10'))
    test_two_value = int(test_two_response['Q0'].startswith('5'))
    data['test_one'].append(test_one_value)
    data['test_two'].append(test_two_value)

    # Actual responses
    headers = ('{}_j{}'.format(q_label, j_label) for q_label, j_label in
               itertools.product(question_labels, judgment_indices))
    for likert_index in range(5, 15):
        likert_data = responses[likert_index]
        likert_responses = json.loads(likert_data['responses'])
        for sorted_label in sorted(likert_responses):
            data[next(headers)].append(int(likert_responses[sorted_label]))

    # Update choices
    choice_data = responses[17]
    choice_responses = json.loads(choice_data['responses'])
    for index, q_label in enumerate(question_labels):
        choice_option = choice_responses.get('Q{}'.format(index), 'Keep Hidden')
        choice_value = int(choice_option == 'Reveal Answer')
        data['{}_choice'.format(q_label)].append(choice_value)


def _fill_view_data(responses, data):
    """
    :param responses: (dict) the data corresponding to a view entry
    :param data: (dict) the structured dictionary to be updated
    :return: (None) updates the dictionary with response data
    """
    for attribute in data:
        data[attribute].append(None)
    data['response_type'][-1] = responses['responseType']
    data['participant_id'][-1] = responses['participantID']
    data['group_number'][-1] = responses['groupNumber']


def _completed(responses):
    """
    :param responses: (object) the data corresponding to one entry in the
        database
    :return: (bool) true if the data corresponds to an entry triggered by
        completing the survey, false if this from simply from starting; this
        throws as AssertionError if neither of these cases are true
    """
    if type(responses) == dict:
        assert responses['responseType'] == 1
        return False
    if type(responses) == list:
        assert responses[0]['responseType'] == 0
        return True


def _get_question_labels(question_scores):
    """
    :param question_scores: [int] the ordered list of scores corresponding to
        the up-votes of questions
    :return: [str] the labels of each of the questions for the DataFrame in
        order
    """
    num_questions = len(question_scores)
    low_nums = iter(range(num_questions // 2))
    high_nums = iter(range(num_questions // 2))
    question_labels = []
    for score in question_scores:
        if score < THRESHOLD:
            question_labels.append('low_q{}'.format(next(low_nums)))
        else:
            question_labels.append('high_q{}'.format(next(high_nums)))
    return question_labels
