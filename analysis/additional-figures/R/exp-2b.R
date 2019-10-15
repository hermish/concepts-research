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
    3.06090534979424, 1.7168724279835395, 2.5720164609053504, 1.8008230452674885, 2.416460905349795, 2.2255144032921814,
    3.484172661870501, 1.6143884892086335, 2.6496402877697847, 0, 0, 2.2496402877697848,
    3.4814814814814805, 1.7934156378600823, 2.8551440329218116, 4.471604938271604, 3.0567901234567882, 2.5465020576131705
  ),
  se=c(
    0.08708556835127079, 0.08677867302581319, 0.0822069278140041, 0.08603070837739102, 0.07974193108745946, 0.08334014977729128,
    0.07087030628635274, 0.07352797928986694, 0.07247601012825244, 0, 0, 0.0717032227640521,
    0.08441716032837629, 0.09057077574386016, 0.08402893743392, 0.08017365370278555, 0.08332530277562553, 0.08671826757953739
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

