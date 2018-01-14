import numpy as np
import matplotlib.pyplot as plt


def plot_double_bar(a_means, a_errs, b_means, b_errs, x_label=None,
                    y_label=None, ticks=None, legend=None, title=None,
                    save=None):
    fig, ax = plt.subplots()
    ind, width = np.arange(len(a_means)), 0.35

    ax.bar(ind, a_means, width, yerr=a_errs)
    ax.bar(ind + width, b_means, width, yerr=b_errs)

    if x_label:
        plt.xlabel(x_label)
    if y_label:
        plt.ylabel(y_label)
    if ticks:
        ax.set_xticks(ind + width / 2)
        ax.set_xticklabels(ticks)
    if legend:
        plt.legend(legend)
    if title:
        plt.title(title)
    if save:
        plt.savefig(save)
    plt.show()
