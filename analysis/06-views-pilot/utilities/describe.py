import scipy.stats as stats


def independent_t_test(first, second):
    t, prob = stats.ttest_ind(first, second)
    winner = 0 if first.mean() > second.mean() else 1
    return 't = {:.3}, p = {:.3} ({} greater)'.format(t, prob, winner)


def paired_t_test(first, second):
    t, prob = stats.ttest_rel(first, second)
    winner = 0 if first.mean() > second.mean() else 1
    return 't = {:.3}, p = {:.3} ({} greater)'.format(t, prob, winner)


def one_sample_t_test(sample, expected_mean):
    t, prob = stats.ttest_1samp(sample, expected_mean)
    relationship = 'smaller' if sample.mean() < expected_mean else 'greater'
    return 't = {:.3}, p = {:.3} ({})'.format(t, prob, relationship)
