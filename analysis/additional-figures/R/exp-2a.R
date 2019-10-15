graph <- data.frame(
	votes=factor(
		c(
		  "low", "low", "low", "low", "low", "low",
		  "control", "control", "control", "control", "control", "control",
			"high", "high", "high", "high", "high", "high"
		),
		levels=c("low", "high", "control")
	),
	judgment=factor(c(
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Surprise', 'Social Utility',
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Surprise', 'Social Utility',
		'Curiosity', 'Confidence', 'Usefulness',
		'Popularity', 'Surprise', 'Social Utility'
	), levels=c('Curiosity', 'Popularity', 'Confidence', 'Surprise', 'Social Utility', 'Usefulness')),
	mean=c(
	  2.983164983164984, 1.7299663299663297, 2.4296296296296296, 1.827609427609427, 2.358922558922558, 2.120538720538721,
	  3.349152542372882, 1.721694915254238, 2.649830508474576, 0, 0, 2.415593220338984,
	  3.4383838383838388, 1.7804713804713799, 2.7649831649831627, 4.22087542087542, 2.9845117845117857, 2.593265993265991
	),
	se=c(
	  0.07704766995023894, 0.0761468044766546, 0.07494190877181982, 0.0773848545844434, 0.06855260153760509, 0.07420865263871017,
	  0.07459157311856353, 0.07813852069409588, 0.07253521205245628, 0, 0, 0.07264566557405276,
	  0.08113552957078504, 0.08088870837335543, 0.07629995629160503, 0.07084813180600136, 0.07135194230169387, 0.07778459263755035
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
scale_fill_manual(values=c("#D9B8C5", "#88ABC2", "#D8D8D8"))

