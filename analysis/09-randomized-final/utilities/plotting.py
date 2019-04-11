import numpy as np
import matplotlib.pyplot as plt

SAVE_KEY = 'save'


def label_graph(**kwargs):
    for key, value in kwargs.items():
        getattr(plt, key)(value)


def plot_single_bar(means, errs=None, **kwargs):
    ind = np.arange(len(means))
    if errs:
        plt.bar(ind, means, yerr=errs)
    else:
        plt.bar(ind, means)
    _add_optional_simple(ind, kwargs)
    if SAVE_KEY in kwargs:
        if kwargs[SAVE_KEY]:
            plt.savefig(kwargs[SAVE_KEY])
    plt.show()


def plot_double_bar(a_means, a_errs, b_means, b_errs, **kwargs):
    fig, ax = plt.subplots()
    ind, width = np.arange(len(a_means)), 0.35

    ax.bar(ind, a_means, width, yerr=a_errs)
    ax.bar(ind + width, b_means, width, yerr=b_errs)
    _add_optional(fig, ax, ind, width, kwargs)
    if SAVE_KEY in kwargs:
        if kwargs[SAVE_KEY]:
            plt.savefig(kwargs[SAVE_KEY])
    plt.show()


def plot_triple_bar(a_means, a_errs, b_means, b_errs, c_means, c_errs,
                    **kwargs):
    fig, ax = plt.subplots()
    ind, width = np.arange(len(a_means)), 0.15

    ax.bar(ind - width, a_means, width, yerr=a_errs)
    ax.bar(ind, b_means, width, yerr=b_errs)
    ax.bar(ind + width, c_means, width, yerr=c_errs)

    _add_optional(fig, ax, ind, width, kwargs)
    plt.show()


def _add_optional_simple(ind, kwargs):
    for key, value in kwargs.items():
        if key == 'ticks':
            plt.xticks(ind, value)
        else:
            getattr(plt, key)(value)


def _add_optional(fig, ax, ind, width, kwargs):
    for key, value in kwargs.items():
        if key == 'ticks':
            ax.set_xticks(ind + width / 2)
            ax.set_xticklabels(value)
        elif key == 'size':
            fig.set_size_inches(*value)
        else:
            getattr(plt, key)(value)
