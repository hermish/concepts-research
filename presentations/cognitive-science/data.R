# EXPERIMENT 1
# Popularity

graph <- data.frame(
	votes=factor(c("high", "low"), levels=c("low", "high")),
	judgment=c("popularity", "popularity"),
	mean=c(4.533999999999997,
		1.4380000000000002),
	se=c(0.07077317860153336,
		0.07033022918435393)
)

ggplot(
	data=graph,
	aes(x=judgment, y=mean, fill=votes)
) +
geom_bar(stat="identity", position = "dodge") + 
geom_errorbar(
	aes(
		ymin=mean-se, ymax=mean+se),
		width=0,
		size=0.5,
		position=position_dodge(.9)
) + 
theme_minimal() +
scale_fill_manual(values=c("#AFD5E6", "#889CB3"))

# Curiosity

graph <- data.frame(
	votes=factor(c("high", "low"), levels=c("low", "high")),
	judgment=c("curiosity", "curiosity"),
	mean=c(
		3.206666666666666,
		2.0),
	se=c(
		0.08282543102978346,
		0.07460636201468195)
)

ggplot(
	data=graph,
	aes(x=judgment, y=mean, fill=votes)
) +
geom_bar(stat="identity", position = "dodge") + 
geom_errorbar(
	aes(
		ymin=mean-se, ymax=mean+se),
		width=0,
		size=0.5,
		position=position_dodge(.9)
) + 
theme_minimal() +
scale_fill_manual(values=c("#AFD5E6", "#889CB3"))


graph <- data.frame(
	votes=factor(c("high", "high", "low", "low"), levels=c("low", "high")),
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
	data=graph,
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

graph <- data.frame(
	label=factor(c("Low Scores", "High Scores"), levels=c("Low Scores", "High Scores")),
	proportion=c(0.3527397260273976, 0.6472602739726027),
	se=c(0.013209931327771474, 0.013209931327771474)
)

ggplot(
	data=graph,
	aes(x=label, y=proportion)
) +
geom_bar(stat="identity", position = "dodge", width = 0.75, fill="#B1D7BF") + 
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

graph <- data.frame(
	votes=factor(
		c(
			"high", "high", "high", "high", "high", "high", "high",
			"low", "low", "low", "low", "low", "low", "low"
		),
		levels=c("low", "high")
	),
	judgment=factor(c(
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Writing', 'Surprise', 'Social Utility',
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Writing', 'Surprise', 'Social Utility'
	), levels=c('Curiosity', 'Popularity', 'Confidence', 'Surprise', 'Social Utility', 'Usefulness', 'Writing')),
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
	data=graph,
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

# Graph 1'

graph <- data.frame(
	votes=factor(
		c(
			"high", "high", "high", "high", "high", "high",
			"low", "low", "low", "low", "low", "low"
		),
		levels=c("low", "high")
	),
	judgment=factor(c(
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Surprise', 'Social Utility',
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Surprise', 'Social Utility'
	), levels=c('Curiosity', 'Popularity', 'Confidence', 'Surprise', 'Social Utility', 'Usefulness')),
	mean=c(
		3.3986301369863003, 1.7575342465753403, 2.6363013698630144, 4.075342465753427, 2.8068493150684954, 2.3979452054794512,
		2.9431506849315054, 1.7636986301369875, 2.3458904109589063, 1.8020547945205476, 2.2780821917808214, 2.0445205479452033
	),
	se=c(
		0.08016008761625637, 0.07473481060162566, 0.0762579240292879, 0.07053424433087782, 0.07665283232229567, 0.07724413806165674,
		0.07753136841732439, 0.08048650538340679, 0.07229119195825298, 0.0685591524014007, 0.06581444586494796, 0.07106605408143048
	)
)

ggplot(
	data=graph,
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

graph <- data.frame(
	label=factor(c("Low Scores", "High Scores"), levels=c("Low Scores", "High Scores")),
	proportion=c(0.4520547945205479, 0.5479452054794521),
	se=c(0.01132013052992385, 0.011320130529923852)
)

ggplot(
	data=graph,
	aes(x=label, y=proportion)
) +
geom_bar(stat="identity", position = "dodge", width = 0.75, fill="#B1D7BF") + 
geom_errorbar(
	aes(
		ymin=proportion-se, ymax=proportion+se),
		width=0,
		size=0.75,
		position=position_dodge(.9)
) + 
theme_minimal()
