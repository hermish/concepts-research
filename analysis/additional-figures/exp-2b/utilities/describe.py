import scipy.stats as stats


def independent_t_test(first, second):
    t, prob = stats.ttest_ind(first, second)
    difference = second.mean() - first.mean()
    winner = 1 if difference > 0 else 0
    return 't = {:.3}, p = {:.3}, Δ = {:.3} ({} greater)'.format(t, prob, difference, winner)

def paired_t_test(first, second):
    t, prob = stats.ttest_rel(first, second)
    difference = second.mean() - first.mean()
    winner = 1 if difference > 0 else 0
    return 't = {:.3}, p = {:.3}, Δ = {:.3} ({} greater)'.format(t, prob, difference, winner)


def one_sample_t_test(sample, expected_mean):
    t, prob = stats.ttest_1samp(sample, expected_mean)
    relationship = 'smaller' if sample.mean() < expected_mean else 'greater'
    return 't = {:.3}, p = {:.3} ({})'.format(t, prob, relationship)
