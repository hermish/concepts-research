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


# Proportion


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
# Popularity

graph <- data.frame(
	votes=factor(c("high", "low"), levels=c("low", "high")),
	judgment=c("popularity", "popularity"),
	mean=c(4.075342465753427,
		1.8020547945205476),
	se=c(0.07053424433087782,
		0.0685591524014007)
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
		3.3986301369863003,
		2.9431506849315054),
	se=c(
		0.08016008761625637,
		0.07753136841732439)
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


# Remaining

graph <- data.frame(
	votes=factor(
		c(
			"high", "high", "high", "high",
			"low", "low", "low", "low"
		),
		levels=c("low", "high")
	),
	judgment=factor(c(
		'Confidence', 'Usefulness',
		'Surprise', 'Social Utility',
		'Confidence', 'Usefulness',
		'Surprise', 'Social Utility'
	), levels=c('Confidence', 'Surprise', 'Social Utility', 'Usefulness', 'Writing')),
	mean=c(
		1.7575342465753403, 2.6363013698630144, 2.8068493150684954, 2.3979452054794512,
		1.7636986301369875, 2.3458904109589063, 2.2780821917808214, 2.0445205479452033
	),
	se=c(
		0.07473481060162566, 0.0762579240292879, 0.07665283232229567, 0.07724413806165674,
		0.08048650538340679, 0.07229119195825298, 0.06581444586494796, 0.07106605408143048
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
scale_fill_manual(values=c("#AFD5E6", "#889CB3"))

# Proportion

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

# Comparison
graph <- data.frame(
	label=factor(c("Partial Information", "Full Information"), levels=c("Partial Information", "Full Information")),
	difference=c(1.2349315068493145, 0.4554794520547946),
	se=c(0.08717639257383701, 0.06819966071167162)
)

ggplot(
	data=graph,
	aes(x=label, y=difference)
) +
geom_bar(stat="identity", position = "dodge", width = 0.75, fill="#676466") + 
geom_errorbar(
	aes(
		ymin=difference-se, ymax=difference+se),
		width=0,
		size=0.75,
		position=position_dodge(.9)
) + 
theme_minimal()