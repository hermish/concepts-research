def get_col_labels(num_questions, num_judgements, choice):
    """
    :param question_num: (int) the number of question
    :param judgement_num: (int) the number fo responses
    :return: (gen) a generator yielding strings for column names
    """
    yield from ['condition', 'consent']
    for q_num in range(num_questions):
        yield 'q{}score'.format(q_num)
        for j_num in range(num_judgements):
            yield 'q{}j{}'.format(q_num, j_num)
    if choice:
        for q_num in range(num_questions):
            yield 'q{}choice'.format(q_num)


def fill_responses_data(data, questions, judgements, choice):
    # Update experimental condition ['A', 'B']
    def update_condition(person):
        first_response = person['data'][0]
        condition_group = first_response['condition'][-1]
        data['condition'].append(condition_group)

    # Update consent [0, 1]
    def update_consent(person):
        first_response = person['data'][0]
        consent_answer = json.loads(first_response['responses'])
        consent_value = int(consent_answer['Q0'].startswith('I consent'))
        data['consent'].append(consent_value)

    # Resolves question order and updates the scores assigned to each question
    def update_scores(person):
        first_response = person['data'][0]
        for text in first_response['randomQuestions']:
            question_label = questions[text]
            question_order.append(question_label)
        for label, sc in zip(question_order, first_response['randomScores']):
            data[label + 'score'].append(sc)

    # Resolves judgement order and updates the rating given for each question
    def update_judgements(person):
        first_response = person['data'][0]
        for text in first_response['randomJudgements']:
            judgements_order.append(judgements[text])
        headers = (ques_num + judge_num for ques_num, judge_num in
                   itertools.product(question_order, judgements_order))
        for likert_index in range(2, 12):
            likert_data = person['data'][likert_index]
            likert_responses = json.loads(likert_data['responses'])
            for sorted_label in sorted(likert_responses):
                data[next(headers)].append(int(likert_responses[sorted_label]))

    # Updates which questions are liked
    def update_choices(person):
        choice_data = person['data'][13]
        choice_responses = json.loads(choice_data['responses'])
        for header, label in zip(question_order, sorted(choice_responses)):
            choice_option = choice_responses[label]
            choice_value = 1 if choice_option == 'Reveal Answer' else 0
            data[header + 'choice'].append(choice_value)

    # Fills responses for each person!
    for person in master_responses:
        question_order = []
        judgements_order = []
        update_condition(person)
        update_consent(person)
        update_scores(person)
        update_judgements(person)
        if choice:
            update_choices(person)
