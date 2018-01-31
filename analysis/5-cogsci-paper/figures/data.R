# EXPERIMENT 1
# Graph 1

data_exp_one <- data.frame(
	votes=c("high", "high", "low", "low"),
	judgment=c("popularity", "curiosity", "popularity", "curiosity"),
	mean=c(4.533999999999997,
		3.206666666666666,
		1.4380000000000002,
		2.0),
	se=c(0.07077317860153336,
		0.08282543102978346,
		0.07033022918435393,
		0.07460636201468195)
)

ggplot(
	data=data_exp_one,
	aes(x=judgment, y=mean, fill=votes)
) +
geom_bar(stat="identity", position = "dodge") + 
geom_errorbar(
	aes(
		ymin=mean-se, ymax=mean+se),
		width=0,
		size=0.75,
		position=position_dodge(.9)
) + 
theme_minimal() +
scale_fill_manual(values=c("#D9B8C5", "#88ABC2"))

# Graph 2

data_exp_one <- data.frame(
	label=factor(c("Low Scores", "High Scores"), levels=c("Low Scores", "High Scores")),
	proportion=c(0.3527397260273976, 0.6472602739726027),
	se=c(0.013209931327771474, 0.013209931327771474)
)

ggplot(
	data=data_exp_one,
	aes(x=label, y=proportion)
) +
geom_bar(stat="identity", position = "dodge", width = 0.5, fill="#B1D7BF") + 
geom_errorbar(
	aes(
		ymin=proportion-se, ymax=proportion+se),
		width=0,
		size=0.75,
		position=position_dodge(.9)
) + 
theme_minimal()

# EXPERIMENT 2
# Graph 1

data_exp_two <- data.frame(
	votes=factor(
		c(
			"high", "high", "high", "high", "high", "high", "high",
			"low", "low", "low", "low", "low", "low", "low"
		),
		levels=c("low", "high")
	),
	judgment=c(
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Writing', 'Surprise', 'Social Utility',
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Writing', 'Surprise', 'Social Utility'
	),
	mean=c(
		3.3986301369863003, 1.7575342465753403, 2.6363013698630144, 4.075342465753427, 3.9417808219178068, 2.8068493150684954, 2.3979452054794512,
		2.9431506849315054, 1.7636986301369875, 2.3458904109589063, 1.8020547945205476, 3.685616438356163, 2.2780821917808214, 2.0445205479452033
	),
	se=c(
		0.08016008761625637, 0.07473481060162566, 0.0762579240292879, 0.07053424433087782, 0.06057304861858781, 0.07665283232229567, 0.07724413806165674,
		0.07753136841732439, 0.08048650538340679, 0.07229119195825298, 0.0685591524014007, 0.05840982157986506, 0.06581444586494796, 0.07106605408143048
	)
)

ggplot(
	data=data_exp_two,
	aes(x=judgment, y=mean, fill=votes)
) +
geom_bar(stat="identity", position = "dodge") + 
geom_errorbar(
	aes(
		ymin=mean-se, ymax=mean+se),
		width=0,
		size=0.75,
		position=position_dodge(.9)
) + 
theme_minimal() +
scale_fill_manual(values=c("#D9B8C5", "#88ABC2"))

# Graph 2
