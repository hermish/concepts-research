import numpy as np
import matplotlib.pyplot as plt

SAVE_KEY = 'save'


def plot_double_bar(a_means, a_errs, b_means, b_errs, **kwargs):
    fig, ax = plt.subplots()
    ind, width = np.arange(len(a_means)), 0.35

    ax.bar(ind, a_means, width, yerr=a_errs)
    ax.bar(ind + width, b_means, width, yerr=b_errs)
    _add_optional(plt, ax, ind, width, kwargs)
    if SAVE_KEY in kwargs:
        if kwargs[SAVE_KEY]:
            plt.save(kwargs[SAVE_KEY])
    plt.show()


def _add_optional(plt, ax, ind, width, kwargs):
    for key, value in kwargs.items():
        if key == 'x_label':
            plt.xlabel(value)
        if key == 'y_label':
            plt.ylabel(value)
        if key == 'ticks':
            ax.set_xticks(ind + width / 2)
            ax.set_xticklabels(value)
        if key == 'legend':
            plt.legend(value)
        if key == 'title':
            plt.title(value)