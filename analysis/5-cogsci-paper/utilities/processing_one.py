import json
import itertools

THRESHOLD = 240.9


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
    yield 'consent'
    for q_num in range(num_questions // 2):
        yield from ['low_q{}_score'.format(q_num),
                    'low_q{}_index'.format(q_num),
                    'low_q{}_choice'.format(q_num)]
        for j_num in range(num_judgments):
            yield 'low_q{}_j{}'.format(q_num, j_num)
    for q_num in range(num_questions // 2):
        yield from ['high_q{}_score'.format(q_num),
                    'high_q{}_index'.format(q_num),
                    'high_q{}_choice'.format(q_num)]
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
        # Grab person and first response
        responses = person['data']
        first_response = responses[0]

        # Gather experimental set-up information
        judgment_indices = first_response['judgmentIndicies']
        question_indices = first_response['questionIndicies']
        question_scores = first_response['questionScores']
        question_labels = _get_question_labels(question_scores)

        # Update score and index information
        for label, score, index in zip(question_labels, question_scores,
                                       question_indices):
            data['{}_score'.format(label)].append(score)
            data['{}_index'.format(label)].append(index)

        # Update consent information
        consent_answer = json.loads(first_response['responses'])
        consent_value = 1 if consent_answer['Q0'].startswith(
            'I consent') else 0
        data['consent'].append(consent_value)

        # Update judgment responses
        headers = ('{}_j{}'.format(q_label, j_label) for q_label, j_label in
                   itertools.product(question_labels, judgment_indices))
        for likert_index in range(3, 13):
            likert_data = responses[likert_index]
            likert_responses = json.loads(likert_data['responses'])
            for sorted_label in sorted(likert_responses):
                data[next(headers)].append(int(likert_responses[sorted_label]))

        # Update choices
        choice_data = responses[14]
        choice_responses = json.loads(choice_data['responses'])
        for q_label, key in zip(question_labels, sorted(choice_responses)):
            choice_option = choice_responses[key]
            choice_value = 1 if choice_option == 'Reveal Answer' else 0
            data['{}_choice'.format(q_label)].append(choice_value)


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
