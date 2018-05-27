import json

STANDARD = ('consent', 'participant_id', 'response_type', 'condition_number',
            'high_group', 'quiz_one', 'quiz_two')


def get_article_labels(number_of_groups, group_size):
    """
    :param number_of_groups: (int) number of groups of questions
    :param group_size: (int) the number of articles in each group
    :return: [str] list of all labels for articles
    """
    labels = []
    for group_num in range(number_of_groups):
        for q_index in range(group_size):
            labels.append('g{}_i{}'.format(group_num, q_index))
    return labels


def get_judgment_labels(num_judgments):
    """
    :param num_judgments: (int) the number of total judgments
    :return: [str] a list of all the judgment suffixes in columns names
    """
    return ['j{}'.format(num) for num in range(num_judgments)]


def get_col_labels(number_of_groups, group_size, num_judgements):
    """
    :param number_of_groups: (int) number of groups of questions
    :param group_size: (int) the number of articles in each group
    :param num_judgements: (int) the total number of judgements
    :return: (gen) a generator yielding strings for column names
    """
    yield from STANDARD
    for group_num in range(number_of_groups):
        for q_index in range(group_size):
            yield 'g{}_i{}_number'.format(group_num, q_index)
            yield 'g{}_i{}_time'.format(group_num, q_index)
    for group_num in range(number_of_groups):
        for q_index in range(group_size):
            for j_num in range(num_judgements):
                yield 'g{}_i{}_j{}'.format(group_num, q_index, j_num)


def fill_experiment_data(data, master_responses):
    """
    :param data: (dict) a structured dictionary with lists as values which will
        be updated
    :param master_responses: [dict] list of responses to the survey
    :return: (None) the dictionary data is mutated
    """
    for entry in master_responses:
        responses = entry['data']
        if _completed(responses):
            _fill_completed_data(responses, data)
        else:
            _fill_view_data(responses, data)


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
    assert responses[0]['responseType'] == 0
    return True


def _fill_completed_data(responses, data):
    """
    :param responses: [dict] the data corresponding to a completed entry
    :param data: (dict) the structured dictionary to be updated
    :return: (None) updates the dictionary with response data
    """
    first_entry = responses[0]
    judgment_indices = first_entry['judgmentIndices']
    article_groups = first_entry['articleGroups']
    article_indices = first_entry['articleIndices']
    article_numbers = first_entry['articleNumbers']
    article_labels = _get_ordered_labels(article_groups, article_indices)

    # General information
    data['response_type'].append(first_entry['responseType'])
    data['participant_id'].append(first_entry['participantID'])
    data['condition_number'].append(first_entry['conditionNumber'])
    data['high_group'].append(first_entry['groupNumber'])

    # Fill in numbers
    for label, number in zip(article_labels, article_numbers):
        data['{}_number'.format(label)].append(number)

    # Consent information
    consent_answer = json.loads(first_entry['responses'])
    consent_value = int(consent_answer['Q0'].startswith('I consent'))
    data['consent'].append(consent_value)

    # Actual likert responses
    likert_indices = range(4, 8)
    for label, likert_index in zip(article_labels, likert_indices):
        likert_data = responses[likert_index]
        likert_responses = json.loads(likert_data['responses'])
        for j_num, key in zip(judgment_indices, sorted(likert_responses)):
            value = int(likert_responses[key])
            data['{}_j{}'.format(label, j_num)].append(value)

    # Reading time data
    reading_index = 9
    reading_times = [0 for _ in article_labels]
    reading_log = json.loads(responses[reading_index]['view_history'])
    for visit in reading_log:
        internal_index = visit['page_index']
        reading_times[internal_index] += visit['viewing_time']
    for label, time in zip(article_labels, reading_times):
        data['{}_time'.format(label)].append(time)

    # Quiz information
    quiz_index = 11
    quiz_responses = json.loads(responses[quiz_index]['responses'])
    quiz_one = int(quiz_responses['Q0'].startswith('4'))
    quiz_two = int(quiz_responses['Q1'].startswith('3'))
    data['quiz_one'].append(quiz_one)
    data['quiz_two'].append(quiz_two)


def _get_ordered_labels(article_groups, article_indices):
    """
    :param article_groups: [int] group numbers corresponding to articles
    :param article_indices: [int] indices of articles within groups options
    :return: [str] ordered list of all labels for articles
    """
    labels = []
    for group_num, index_num in zip(article_groups, article_indices):
        labels.append('g{}_i{}'.format(group_num, index_num))
    return labels


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
    data['condition_number'][-1] = responses['conditionNumber']
    data['high_group'][-1] = responses['groupNumber']
