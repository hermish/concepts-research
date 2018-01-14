import numpy as np
import scipy.stats as stats


def independent_t_test(first, second, label):
    t, prob = stats.ttest_ind(first, second)
    winner = 0 if first.mean() > second.mean() else 1
    return '{}: t = {:.3}, p = {:.3} ({} greater)'.format(
        label, t, prob, winner)


def paired_t_test(first, second, label):
    t, prob = stats.stats.ttest_rel(first, second)
    winner = 0 if first.mean() > second.mean() else 1
    return '{}: t = {:.3}, p = {:.3} ({} greater)'.format(
        label, t, prob, winner)
