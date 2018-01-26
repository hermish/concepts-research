/* PARTICIPANT JUDGEMENTS */
var judgments = Object.freeze({
	questions: [
		'How curious are you about the answer to this question?',
		'How confident are you that you know the correct answer to this question?',
		'To what extent would knowing the answer to this question be useful to you in the future?',
		'How popular do you think this question is in this social forum?',
		'How well-written do you think this question is?',
		'How surprised are you by the popularity of this question?',
		'To what extent would knowing the answer to this question be useful to you in a social setting?'
	],
	choices: [
		['not curious at all', '', '', '', '', '', 'very curious'],
		['not confident at all', '', '', '', '', '', 'very confident'],
		['not useful at all', '', '', '', '', '', 'very useful'],
		['not at all', '', '', '', '', '', 'very popular'],
		['not at all', '', '', '', '', '',  'very well-written'],
		['not surprised at all', '', '', '', '', '', 'very surprised'],
		['not useful at all', '', '', '', '', '', 'very useful']
	]
});

var rawQuestions = [
	"Why do your eyelids get puffy after crying?",
	"Why aren't other animals as freaked out by bugs and creepy crawlies as humans?",
	"Why do some alcoholics suffer life threatening withdrawal symptoms, while others with the same drinking habits don't when they quit?",
	"How do scientists know what the global temperature was millions of years ago?",
	"Why is the consistency of my ice cream different when it melts and I refreeze it?",
	"How does the body separate water from stomach acid?",
	"Why is CPR for drowning different than CPR for people who collapse from heart problems? (e.g rescue breaths are recommended for one but not the other)",
	"What make some objects 'bouncier' than others?",
	"What gives something it's taste? Does pyrite taste like table salt because they are both cubes?",
	"Why do typical spray pump bottles of cologne or perfume evaporate quickly when left on their side or \"tipped over,\" but not while upright?",
	
	"Why do car windows get a grid pattern on them",
	"Why is math (statistics, calculus, etc) so important for a strong programmer?",
	"What makes something microwaveable or non-microwaveable? Is all food microwaveable?",
	"How do they get the liquid medicine to completely fill liquicaps, like Dayquil?",
	"How do such small doses of things like cocaine and heroin kill you? How do these small powders have such a big effect on your body?",
	"What causes those pulled neck muscles that happen from doing nothing like yawning or rolling in your sleep?",
	"What is the difference between forward and reverse osmosis?",
	"How does sleep restore the body's energy?",
	"How do our lungs prevent or eliminate dust?",
	"What exactly is happening when we blur our eyes on command?",
	
	"Why are bodies able to create an entire body with it's own lifetime supply of regenerative cells, but is itself unable to prevent gradual decay over a lifetime?",
	"How does rabies induce hydrophobia?",
	"How can certain animals such as frogs and flies freeze solid and survive, but most mammals suffer extreme tissue damage?",
	"How do breeders ensure diversity among their animals' offspring? Wouldn't they have to constantly buy new breeding pairs?",
	"If rockets use controlled explosions to propel forward, why can't we use a nuclear reaction to launch/fly our rockets?",
	"How can alcohol withdrawal or detox kill you?",
	"Why do tongues get weird bumps when burnt or after eating something really sweet or really salty?",
	"Do multivitamins and Omega-3 pills actually do anything? Or is it more of a placebo-type thing?",
	"How do flares stop missiles?",
	"Why is it that drinking fizzy drinks, even if they don't touch your teeth, is harmful to your teeth?",
	
	"Why does giving someone a transfusion of my blood to someone not give them my immunity?",
	"Why can't the asteroid belt accumulate into one rocky planet?",
	"How do earphones produce adequate bass despite their size?",
	"An anechoic chamber at Orfield Laboratories in Minnesota has negative decibel levels (lower than -9db). How is this possible?",
	"How do car dealerships make money when they claim the markup on new cars is only a few hundred dollars?",
	"Why do US based airlines lag behind in service and quality, especially in their premium cabins?",
	"What are the biological advantages and disadvantages of trees shedding their leaves vs keeping them all year round (deciduous vs coniferous)?",
	"What determines where a person will store the excess fat? Why it differs from person to person?",
	"Why are 9mm bullets less dangerous than 7.62 or even 5.56 ones? Shouldn't they deal more damage with bigger size?",
	"When bacteria die, for example when boiling water, where do their corpses go?",
	
	"What happens that makes beer taste terrible after warming up and then re-chilling? What makes beer 'skunky'?",
	"What is the difference between beat, bar, steps, tempo, tact, and rhythm?",
	"Why does shampoo not lather up well when you shampoo for the first time in a while?",
	"Why is therapy effective? What is it about the brain that allows talking about your problems to help fix them?",
	"Why do we toss and turn/constantly reposition ourselves during our sleep? What makes one position suddenly stop being comfortable even when we are not fully conscious?",
	"What is the difference between time signatures that have the same ratio?",
	"What's special about CO2 that we add it to water/soda and not other gasses? Why not use compressed air or another gas?",
	"What occurs physically that causes a person to foam at the mouth?",
	"Why is it hard to implement a standard volume across various mediums like radio and television?",
	"Why waves? All energy transfer in nature from one point to another happens in waves. Light, sound, even gravity travels in waves. Which fundamental property of nature is responsible for wave-like nature? Are there other non-wave like ways to transfer energy from one point to another?"
]