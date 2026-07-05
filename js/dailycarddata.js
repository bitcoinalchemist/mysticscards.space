// dailycarddata.js — original Sage-voice daily-card readings for mysticscards.space.
//
// The daily card always lands on a card UNDER one of the seven planets (see the
// daily-book-of-life-card schedule), so each card carries one reading per planet.
// These match the register of the daily-card messages: name the card's Cardology
// identity, bring the planet in by name and show how it bends that energy, then
// close on a concrete directive. ~3 sentences each, original oracle copy (the
// card's energy set against the planet's archetype) — not Richmond's text.
//
// Wired in: openCompareCard's {period,planet} lookup (js/cardsdata.js,
// _CC_PERIOD_SOURCES.daily) reads window.DAILY_CARDS when openPeriodReading('daily')
// is called from the "Your Cards" Daily tile — and it's listed in sw.js PRECACHE.
//
// key = `${rank}_${suit}` (matches CARDS / RICHMOND); planets = Mercury..Neptune.
// Data itself is still partial — built suit by suit: Hearts done; Clubs /
// Diamonds / Spades to follow. Cards without an entry here just fall back to
// the card's plain (non-period) reading in the popup.
window.DAILY_CARDS = {
  "A_hearts": { name: "Ace of Hearts", planets: {
    Mercury: "The Ace of Hearts is the card of the open heart, desire taking its first breath. Mercury runs that feeling up into the mind today, so a name, a message, a half-formed wish keeps circling back to you. Let the heart say its plain thing before the clever part talks it out of speaking.",
    Venus: "The Ace of Hearts is the card of the open heart, love at its first spark. Venus is its own planet here and doubles the warmth, so the day tilts toward affection freely given and freely met. Open the door you have been guarding and let someone through it.",
    Mars: "The Ace of Hearts is the card of the open heart, desire newly lit. Mars puts fire under it today, turning the quiet wish into a pull that wants to move now. Want boldly, make the first move, and let no old shyness stand at the door.",
    Jupiter: "The Ace of Hearts is the card of the open heart, the first warmth of wanting. Jupiter widens it into generosity today, an affection that grows the more of it you spend. Give it without a ledger, and watch how much of it comes back.",
    Saturn: "The Ace of Hearts is the card of the open heart, fresh desire reaching out. Saturn meets that reach with a wall today, a longing that cannot have what it wants yet. Hold the feeling gently, let it teach patience, and keep it from souring into complaint.",
    Uranus: "The Ace of Hearts is the card of the open heart, desire arriving unannounced. Uranus makes it sudden today, a pull toward someone or something you never planned for. Follow the strange warmth, it knows a truth your schedule does not.",
    Neptune: "The Ace of Hearts is the card of the open heart, longing in its purest form. Neptune stretches it across distance today, toward someone far off or a love not yet seen. Let the wanting travel, it carries further than you think and it is heard."
  } },
  "2_hearts": { name: "Two of Hearts", planets: {
    Mercury: "The Two of Hearts is the card of union, two drawn into one. Mercury works through talk today, where a single conversation lands on the same wavelength and the distance between you closes. Say the true thing plainly, this bond is built in honest words.",
    Venus: "The Two of Hearts is the card of union, the meeting of hearts. Venus blesses it fully today, lovers and dear friends inclined toward each other with ease. Show up open, stay present, and let the closeness be simple.",
    Mars: "The Two of Hearts is the card of union, two bound close. Mars strikes a spark of friction today, a quarrel quick and hot between people who care. Let the heat pass through without wreckage, the bond underneath is sound.",
    Jupiter: "The Two of Hearts is the card of union, the joining of two. Jupiter grows it by sharing today, a love or friendship made richer the moment the circle widens. Open the door, set another place, and let the good multiply.",
    Saturn: "The Two of Hearts is the card of union, two held together. Saturn tests the tie today with duty, distance, or plain time. Tend it like something living, show up for the unglamorous part, and it holds.",
    Uranus: "The Two of Hearts is the card of union, two made one. Uranus makes the meeting sudden today, an unplanned partnership that clicks into place and surprises you. Trust the pairing, it runs on a logic older than your plans.",
    Neptune: "The Two of Hearts is the card of union, the bond between two. Neptune reaches it across distance today, a reunion stirring or word from someone dear and far. Trust the thread between you, it was never actually cut."
  } },
  "3_hearts": { name: "Three of Hearts", planets: {
    Mercury: "The Three of Hearts is the card of the divided heart, feeling that runs more directions than one. Mercury sets the mind to refereeing it today, weighing options it cannot settle. Stop tallying, sit with what is true beneath the noise, and the real answer surfaces.",
    Venus: "The Three of Hearts is the card of the divided heart, affection pulled more than one way. Venus sweetens the confusion today, more than one love looking good at once. Choose the one that steadies you over the one that merely flatters.",
    Mars: "The Three of Hearts is the card of the divided heart, want split against itself. Mars turns the division into friction today, with others or inside your own chest. Pick a single direction and the tension drains out of the day.",
    Jupiter: "The Three of Hearts is the card of the divided heart, feeling in abundance. Jupiter sends more of it than you can spend today, a surplus with nowhere to land. Pour the overflow into making something, the feeling is looking for a form.",
    Saturn: "The Three of Hearts is the card of the divided heart, torn between two goods. Saturn hardens the indecision into worry today, a weight that circles and will not rest. Name the fear out loud, and the option you dreaded loses its teeth.",
    Uranus: "The Three of Hearts is the card of the divided heart, certainty split open. Uranus brings the feeling you did not expect today, the one that scrambles your settled mind. Let it disturb you, it is pointing at a truer want than the one you planned.",
    Neptune: "The Three of Hearts is the card of the divided heart, longing in two places at once. Neptune stretches you between here and somewhere far today. Let the pull stay unresolved, not every division needs to be settled by nightfall."
  } },
  "4_hearts": { name: "Four of Hearts", planets: {
    Mercury: "The Four of Hearts is the card of the settled heart, love with a roof and a hearth. Mercury brings a small word today that settles the household, a message that puts something at ease. Take it in, and let the ordinary peace actually register.",
    Venus: "The Four of Hearts is the card of the settled heart, contentment in a warm room. Venus rests easy today, love on firm and familiar ground. Stop reaching for more and be fully inside the comfort you already have.",
    Mars: "The Four of Hearts is the card of the settled heart, the secure home. Mars pushes against the peace today, something testing the quiet you built. Defend the calm if you must, without letting the defense turn into a war.",
    Jupiter: "The Four of Hearts is the card of the settled heart, the full house. Jupiter widens it today, more comfort, more company, more room at the table. Enjoy the plenty, and let others come and sit inside it with you.",
    Saturn: "The Four of Hearts is the card of the settled heart, the foundation. Saturn tests that base for soundness today, pressing on what you have built. What was made true will stand, so shore up the rest without panic.",
    Uranus: "The Four of Hearts is the card of the settled heart, the steady home. Uranus reaches a change into the settled place today, a tremor in the familiar. Let the walls breathe, a security that cannot bend is already cracking.",
    Neptune: "The Four of Hearts is the card of the settled heart, the longing to belong. Neptune calls home from a distance today, a hunger for the hearth somewhere you are not. Carry the warmth within you until you reach the place that holds it."
  } },
  "5_hearts": { name: "Five of Hearts", planets: {
    Mercury: "The Five of Hearts is the card of the restless heart, love that itches for new air. Mercury scatters that restlessness into a hundred passing thoughts today. Let them move through, and do not mistake the itch for an instruction.",
    Venus: "The Five of Hearts is the card of the restless heart, affection hungry for newness. Venus makes the familiar feel small today and the new feel bright. Follow the warmth if you must, but do not burn something good just to feel motion.",
    Mars: "The Five of Hearts is the card of the restless heart, feeling that wants out. Mars charges it today, a surge that needs somewhere to go. Move your body, change the room, spend the charge before it spends you.",
    Jupiter: "The Five of Hearts is the card of the restless heart, change in love. Jupiter opens a wider field today, more room for affection than you stand in now. Step into it generously, there is more here than you feared losing.",
    Saturn: "The Five of Hearts is the card of the restless heart, the wish to bolt. Saturn sets a wall in the way today, a leaving you cannot make yet. Stay put, the restlessness is showing you exactly where you actually want to go.",
    Uranus: "The Five of Hearts is the card of the restless heart, the urge to break the pattern. Uranus answers it today with real disruption, the old arrangement coming loose at the seams. Let it come, it is clearing out a stale and stagnant air.",
    Neptune: "The Five of Hearts is the card of the restless heart, the pull toward elsewhere. Neptune fills the day with longing for water and open distance. Let the daydream run its course, then ask what it is truly hungry for."
  } },
  "6_hearts": { name: "Six of Hearts", planets: {
    Mercury: "The Six of Hearts is the card of the peacemaking heart, love that balances its own books. Mercury circles an old matter back for a word today. Answer it squarely and even-handed, balance is the whole of what is asked.",
    Venus: "The Six of Hearts is the card of the peacemaking heart, feeling returned to its level. Venus brings love back to fairness today, even and unforced. Give what you owe the heart, and harmony settles in on its own.",
    Mars: "The Six of Hearts is the card of the peacemaking heart, the debt of feeling. Mars presses an account to be paid today. Meet it with steadiness rather than heat, and the books come clear.",
    Jupiter: "The Six of Hearts is the card of the peacemaking heart, fair return. Jupiter brings back what you once gave in love, enriched on the way home. Receive it without protest, you earned the ease honestly.",
    Saturn: "The Six of Hearts is the card of the peacemaking heart, the responsibility you carry. Saturn refuses to let it be set down today. Carry it well, this is the weight that makes you someone others can trust.",
    Uranus: "The Six of Hearts is the card of the peacemaking heart, fate squaring accounts. Uranus reaches in and rearranges what you thought was fixed. Let it happen, the sudden change is balancing an old and overdue imbalance.",
    Neptune: "The Six of Hearts is the card of the peacemaking heart, justice across distance. Neptune brings something long owed quietly due today. Trust the slow fairness of feeling, it finds its way home without your forcing."
  } },
  "7_hearts": { name: "Seven of Hearts", planets: {
    Mercury: "The Seven of Hearts is the card of the testing heart, love asked to hold without gripping. Mercury lets doubt talk loudly in the mind today. Let it talk itself out, and keep faith with what your heart already knows.",
    Venus: "The Seven of Hearts is the card of the testing heart, affection without grasping. Venus asks you to give freely today and hold nothing by force. Loosen the grip, what stays of its own will was never yours to clutch.",
    Mars: "The Seven of Hearts is the card of the testing heart, the struggle you cannot win by force. Mars offers a fight today that fighting only worsens. Yield the small battle on purpose to keep the larger peace.",
    Jupiter: "The Seven of Hearts is the card of the testing heart, faith over worry. Jupiter rewards the trust today that fear called foolish. Lean into the warmth, and watch the dread prove far smaller than it claimed.",
    Saturn: "The Seven of Hearts is the card of the testing heart, endurance. Saturn sets a heaviness on the chest today, a weight to be borne. Carry it without bitterness, it is shorter than it feels from the inside.",
    Uranus: "The Seven of Hearts is the card of the testing heart, the grip suddenly loosened. Uranus frees you today from a love you were clutching too hard. Let it go open-handed, what leaves freely makes room for what comes.",
    Neptune: "The Seven of Hearts is the card of the testing heart, faith more than fact. Neptune has you reaching today for something you cannot quite hold. Rest inside the not-knowing, you are held even where you cannot see the floor."
  } },
  "8_hearts": { name: "Eight of Hearts", planets: {
    Mercury: "The Eight of Hearts is the card of the magnetic heart, warmth with real power in it. Mercury puts that pull into your words today, a charm that moves people. Use it to mend something rather than to win something.",
    Venus: "The Eight of Hearts is the card of the magnetic heart, an easy and bright pull. Venus raises your magnetism today, others drawn near without effort. Wield it gently, power in love is meant to heal and not to take.",
    Mars: "The Eight of Hearts is the card of the magnetic heart, the force of feeling. Mars wants it to command today, to push and to dominate. Lead with the heart's strength, and never once use it to overpower.",
    Jupiter: "The Eight of Hearts is the card of the magnetic heart, warmth that opens doors. Jupiter widens your influence today, hands and doors swinging open. Give generously through it, the more of it you spend the larger it grows.",
    Saturn: "The Eight of Hearts is the card of the magnetic heart, strength put to work. Saturn asks your power to feel to steady someone else's pain today. Stand firm for them, this is exactly what the strength was given for.",
    Uranus: "The Eight of Hearts is the card of the magnetic heart, sudden charisma. Uranus surprises even you with it today, a pull that arrives from nowhere. Let it move through cleanly, do not grip it and do not perform it.",
    Neptune: "The Eight of Hearts is the card of the magnetic heart, warmth that travels. Neptune sends your pull past the room today, to those at a distance who feel you anyway. Send the warmth out on purpose, it lands where it is needed."
  } },
  "9_hearts": { name: "Nine of Hearts", planets: {
    Mercury: "The Nine of Hearts is the card of the wide heart, love grown large enough to give itself away. Mercury brings news today that closes a chapter of feeling. Read it without clinging, a completion is its own kind of gift.",
    Venus: "The Nine of Hearts is the card of the wide heart, love come full. Venus asks the fullness to be given away today, not hoarded. Hold the many in that wide warmth, this is the most generous card in the suit.",
    Mars: "The Nine of Hearts is the card of the wide heart, the ending that frees. Mars demands you release your grip today on something already leaving. Let the fist open, what fights to stay was halfway gone already.",
    Jupiter: "The Nine of Hearts is the card of the wide heart, overflow. Jupiter sends fulfillment past the brim today, more than one life can hold. Spend the abundance on the many, it was never meant to be only yours.",
    Saturn: "The Nine of Hearts is the card of the wide heart, the graceful loss. Saturn asks you to let something go cleanly today. Grieve it honestly, and feel how much room the releasing actually makes.",
    Uranus: "The Nine of Hearts is the card of the wide heart, sudden completion. Uranus frees you today from something you held far too long. Let the surprise of it land, your hands are lighter than they were this morning.",
    Neptune: "The Nine of Hearts is the card of the wide heart, the small self dissolving into a larger love. Neptune softens your boundaries today. Let them blur a little, you lose nothing by belonging to more than yourself."
  } },
  "10_hearts": { name: "Ten of Hearts", planets: {
    Mercury: "The Ten of Hearts is the card of the crowded heart, love that arrives in numbers. Mercury turns many voices warm toward you today. Take the goodwill in, then say the gracious thing back to it.",
    Venus: "The Ten of Hearts is the card of the crowded heart, affection in company. Venus fills the day with welcome and the warmth of a crowd. Stand inside it and let yourself simply be glad to be among them.",
    Mars: "The Ten of Hearts is the card of the crowded heart, the wish to win the room. Mars sharpens that drive today, the urge to shine for the many. Lead the gathering with warmth, and let no one be trampled by your light.",
    Jupiter: "The Ten of Hearts is the card of the crowded heart, affection multiplied. Jupiter sends love back to you through many hands today. Receive the plenty of being widely cared for, and pass the glow along.",
    Saturn: "The Ten of Hearts is the card of the crowded heart, public warmth. Saturn lays a quiet duty under the recognition today. Wear the regard lightly, and keep your deeper faith with the few who know you.",
    Uranus: "The Ten of Hearts is the card of the crowded heart, sudden belonging. Uranus drops you today into a circle of unexpected people. Step in, the gathering formed around you for a reason you will see soon enough.",
    Neptune: "The Ten of Hearts is the card of the crowded heart, love from afar. Neptune brings warmth today from many you may never meet. Feel the wide tide of it and let it lift you where you stand."
  } },
  "J_hearts": { name: "Jack of Hearts", planets: {
    Mercury: "The Jack of Hearts is the card of the devoted heart, the youth who gives himself wholly. Mercury quickens a bright young thought of love in you today. Speak it with plain sincerity, the cleverness can wait its turn.",
    Venus: "The Jack of Hearts is the card of the devoted heart, eager to give itself away. Venus raises that devotion today, warm and unguarded. Offer it freely, and keep just enough of the warmth for yourself.",
    Mars: "The Jack of Hearts is the card of the devoted heart, ardor wanting to prove itself. Mars fires the urge today to show your feeling in action. Let the courage serve someone real, not only your own pride.",
    Jupiter: "The Jack of Hearts is the card of the devoted heart, generosity young and wide. Jupiter opens your giving fully today. Give with both hands, the well refills itself faster than you can pour.",
    Saturn: "The Jack of Hearts is the card of the devoted heart, devotion asked to cost something. Saturn calls for a real sacrifice today. Give it willingly, and let no resentment salt the gift afterward.",
    Uranus: "The Jack of Hearts is the card of the devoted heart, ardor that breaks composure. Uranus cracks your careful surface open today. Let the freshness through, it is more honest than the caution it overran.",
    Neptune: "The Jack of Hearts is the card of the devoted heart, love offered to the unseen. Neptune points your devotion today toward something far and beyond sight. Follow it, the heart knows where it means to kneel."
  } },
  "Q_hearts": { name: "Queen of Hearts", planets: {
    Mercury: "The Queen of Hearts is the card of the mothering heart, care that holds and warms. Mercury puts a gentle steadying word in your mouth today. Speak it plainly and kindly, the way the mother in you knows how.",
    Venus: "The Queen of Hearts is the card of the mothering heart, love flowing as care. Venus moves that tenderness toward another today. Nurture freely, and let yourself be tended in your turn.",
    Mars: "The Queen of Hearts is the card of the mothering heart, warmth turned fierce. Mars asks your care to fight for someone today. Protect them with everything, and keep the fierceness clean of cruelty.",
    Jupiter: "The Queen of Hearts is the card of the mothering heart, care that widens. Jupiter stretches your capacity today to hold more than usual. Open your arms wide, there is plenty of you to go around.",
    Saturn: "The Queen of Hearts is the card of the mothering heart, the one leaned on. Saturn sets someone's need against your strength today. Hold steady, and set the boundary that keeps your own giving whole.",
    Uranus: "The Queen of Hearts is the card of the mothering heart, care called into a new shape. Uranus brings a sudden need today that no routine fits. Answer it freshly, love was never meant to be a fixed procedure.",
    Neptune: "The Queen of Hearts is the card of the mothering heart, tenderness that reaches far. Neptune sends your care today toward someone distant or unseen and hurting. Send it out anyway, it crosses the distance and arrives."
  } },
  "K_hearts": { name: "King of Hearts", planets: {
    Mercury: "The King of Hearts is the card of the mastered heart, the one who rules by warmth. Mercury hands you the word that settles a heated room today. Speak from the calm center, and watch others find theirs in it.",
    Venus: "The King of Hearts is the card of the mastered heart, love held in a sure hand. Venus steadies your leading today, warm and even. Be the safety others rest in, that is the whole of this authority.",
    Mars: "The King of Hearts is the card of the mastered heart, feeling and command at odds. Mars pulls the two against each other today. Rule the heat with the heart, command the room without conquering it.",
    Jupiter: "The King of Hearts is the card of the mastered heart, generosity that leads. Jupiter puts the weight of leadership on your giving today. Give well, and let the abundance you set become the standard for the rest.",
    Saturn: "The King of Hearts is the card of the mastered heart, mastery under load. Saturn tests it today with a heavy duty of care. Carry it without going cold, the strength is meant to stay warm under weight.",
    Uranus: "The King of Hearts is the card of the mastered heart, steadiness meeting change. Uranus asks the master to adapt today without losing center. Bend, stay rooted, and lead the disruption with a gentle hand.",
    Neptune: "The King of Hearts is the card of the mastered heart, authority that reaches far. Neptune extends your steadiness today to those who are distant. Trust the long reach of your calm, it holds them even out of sight."
  } },
  "A_clubs": { name: "Ace of Clubs", planets: {
    Mercury: "The Ace of Clubs is the card of the hungry mind, the thirst to know. Mercury is its own element here and doubles the spark, so a question takes hold today and will not let you rest. Chase it down, ask the next thing, the mind is lit for a reason.",
    Venus: "The Ace of Clubs is the card of the hungry mind, curiosity newly lit. Venus turns the wanting toward beauty today, a fascination with someone or something lovely. Learn it for the pleasure of it, not every study needs a use.",
    Mars: "The Ace of Clubs is the card of the hungry mind, the first reach for knowing. Mars puts drive behind the question today, a need to get to the bottom of it now. Pursue the answer hard, but do not mistake speed for understanding.",
    Jupiter: "The Ace of Clubs is the card of the hungry mind, fresh curiosity. Jupiter widens the field today, more to learn than you can hold and all of it inviting. Follow the broadest thread, the abundance of it is the gift.",
    Saturn: "The Ace of Clubs is the card of the hungry mind, a question newly formed. Saturn meets it with a wall today, an answer that will not come on demand. Sit with the not-knowing, the discipline of waiting is its own kind of study.",
    Uranus: "The Ace of Clubs is the card of the hungry mind, curiosity arriving from nowhere. Uranus makes the idea sudden today, a flash that reorders what you thought you knew. Catch it before it goes, the strange thought is the true one.",
    Neptune: "The Ace of Clubs is the card of the hungry mind, the reach toward what is hidden. Neptune points the question today at the unseen, the mystery behind the plain fact. Let the not-knowing stay open, some answers arrive only sideways."
  } },
  "2_clubs": { name: "Two of Clubs", planets: {
    Mercury: "The Two of Clubs is the card of the meeting of minds, ideas passed between two. Mercury runs straight through this card today, a conversation that sparks and builds. Speak and listen in equal measure, the good idea is the one you make together.",
    Venus: "The Two of Clubs is the card of the meeting of minds, thought shared in warmth. Venus sweetens the exchange today, an understanding that feels like affection. Let the talk be kind, agreement is easier than you fear.",
    Mars: "The Two of Clubs is the card of the meeting of minds, two ideas in the room. Mars turns the exchange to debate today, a clash of views with heat in it. Argue the point and not the person, and let the better idea win.",
    Jupiter: "The Two of Clubs is the card of the meeting of minds, thought made larger by sharing. Jupiter widens the conversation today, more voices, more ground covered. Bring others in, the idea grows the moment you stop holding it alone.",
    Saturn: "The Two of Clubs is the card of the meeting of minds, an exchange that must be earned. Saturn slows the talk today, a misunderstanding that takes patience to clear. Stay at the table, say it again more carefully, and the gap closes.",
    Uranus: "The Two of Clubs is the card of the meeting of minds, two thoughts striking light. Uranus makes the meeting sudden today, an idea arriving whole from an unexpected exchange. Follow the spark, the unplanned conversation is the one that matters.",
    Neptune: "The Two of Clubs is the card of the meeting of minds, understanding across distance. Neptune carries the exchange far today, a message or a meeting of thought with someone away. Trust the connection, minds reach each other over any gap."
  } },
  "3_clubs": { name: "Three of Clubs", planets: {
    Mercury: "The Three of Clubs is the card of the restless mind, more ideas than one head can settle. Mercury scatters them today, thoughts firing in every direction at once. Stop chasing all of them, choose the one that matters and let the rest go quiet.",
    Venus: "The Three of Clubs is the card of the restless mind, thought pulled many ways. Venus makes several options look pleasant today, none of them clearly best. Choose the idea that brings real ease over the one that merely charms.",
    Mars: "The Three of Clubs is the card of the restless mind, ideas at war with each other. Mars turns the noise to friction today, a worry that picks fights inside you. Settle on one course and the mental quarrel quiets.",
    Jupiter: "The Three of Clubs is the card of the restless mind, ideas in surplus. Jupiter sends more than you can use today, an overflow of plans and notions. Pour the extra into making something, the surplus wants a shape.",
    Saturn: "The Three of Clubs is the card of the restless mind, worry that circles. Saturn hardens the indecision today, the same anxious loop tightening. Write the fear down plainly, and the spiral loses most of its power.",
    Uranus: "The Three of Clubs is the card of the restless mind, certainty scattered. Uranus throws in the thought you did not expect today, the one that upends your plan. Let it land, the disruption is pointing at a better question.",
    Neptune: "The Three of Clubs is the card of the restless mind, thought split between here and far. Neptune pulls your attention toward the distant and the dreamed today. Let the wandering be, not every loose idea needs catching now."
  } },
  "4_clubs": { name: "Four of Clubs", planets: {
    Mercury: "The Four of Clubs is the card of the settled mind, knowledge that holds. Mercury brings a word today that confirms what you suspected, a fact clicking into place. Take the certainty in, and let your thinking rest on it.",
    Venus: "The Four of Clubs is the card of the settled mind, the comfort of knowing. Venus makes the certainty pleasant today, a belief that feels like home. Enjoy the steadiness, you have earned the right to be sure.",
    Mars: "The Four of Clubs is the card of the settled mind, a conviction held firm. Mars sends something to test it today, a challenge to what you know. Defend the truth calmly, without turning the defense into a brawl.",
    Jupiter: "The Four of Clubs is the card of the settled mind, sound knowledge. Jupiter widens it today, your understanding stretching to cover more. Build on the firm ground, the foundation will carry the weight.",
    Saturn: "The Four of Clubs is the card of the settled mind, the foundation of thought. Saturn tests that base today, pressing on what you believe. What is true will hold, so let the rest be questioned without fear.",
    Uranus: "The Four of Clubs is the card of the settled mind, a fixed certainty. Uranus cracks it open today, a new fact that unsettles the old belief. Let the conviction loosen, a mind that cannot change is already wrong.",
    Neptune: "The Four of Clubs is the card of the settled mind, knowledge at rest. Neptune blurs the edges today, a certainty softening into something more mysterious. Hold what you know lightly, the deeper truth is rarely fixed."
  } },
  "5_clubs": { name: "Five of Clubs", planets: {
    Mercury: "The Five of Clubs is the card of the roaming mind, curiosity that will not sit still. Mercury speeds the wandering today, your thoughts darting from one thing to the next. Let them roam, but pin down the one worth keeping before it flies.",
    Venus: "The Five of Clubs is the card of the roaming mind, attention hungry for the new. Venus makes the familiar dull today and the novel bright. Chase the new idea if you like, without abandoning the good one half-finished.",
    Mars: "The Five of Clubs is the card of the roaming mind, thought that wants out. Mars charges the restlessness today, a mental energy needing a target. Aim it at one real problem and let it burn there.",
    Jupiter: "The Five of Clubs is the card of the roaming mind, curiosity widening. Jupiter opens new ground today, more to explore than yesterday held. Wander generously, there is more to learn here than you risk by moving.",
    Saturn: "The Five of Clubs is the card of the roaming mind, the wish to think of anything else. Saturn sets the dull task in front of you today and will not move it. Stay with it, the focus you resist is exactly the one you need.",
    Uranus: "The Five of Clubs is the card of the roaming mind, the urge to break routine. Uranus scatters your settled thinking today with something genuinely new. Let it disrupt you, the stale mental groove was overdue to break.",
    Neptune: "The Five of Clubs is the card of the roaming mind, thought drifting toward the far. Neptune fills the day with mental wandering, ideas of elsewhere and otherwise. Let the drift run, then ask what it is really searching for."
  } },
  "6_clubs": { name: "Six of Clubs", planets: {
    Mercury: "The Six of Clubs is the card of the responsible mind, the messenger who must be true. Mercury hands you words that carry weight today, a message that matters to someone. Say it accurately and kindly, the responsibility is in the telling.",
    Venus: "The Six of Clubs is the card of the responsible mind, thought returned to fairness. Venus evens your judgment today, a chance to set a mental score straight. Speak the balanced word, and let an old misunderstanding rest.",
    Mars: "The Six of Clubs is the card of the responsible mind, a duty of truth. Mars presses you to say the hard thing today. Deliver it with steadiness rather than heat, and the air clears.",
    Jupiter: "The Six of Clubs is the card of the responsible mind, the word that pays back. Jupiter returns to you the understanding you once gave, enriched. Receive the credit honestly, your earlier honesty earned it.",
    Saturn: "The Six of Clubs is the card of the responsible mind, the duty you cannot set down. Saturn keeps a mental obligation on your shoulders today. Carry it well, being trusted with the truth is its own quiet weight.",
    Uranus: "The Six of Clubs is the card of the responsible mind, fate rearranging your thinking. Uranus delivers a sudden message today that changes the account. Let it reorder you, the disruption is squaring something overdue.",
    Neptune: "The Six of Clubs is the card of the responsible mind, truth owed across distance. Neptune brings a long-due word quietly home today. Trust the slow arrival of honesty, it reaches the right ear in time."
  } },
  "7_clubs": { name: "Seven of Clubs", planets: {
    Mercury: "The Seven of Clubs is the card of the doubting mind, knowledge tested against faith. Mercury lets the doubt argue loudly today, every certainty questioned. Let it speak, then keep faith with the deeper thing you already understand.",
    Venus: "The Seven of Clubs is the card of the doubting mind, belief asked to soften. Venus warms the worry today, a fear eased by a gentler view. Trust the kinder reading, the mind tortures itself with the harsher one for nothing.",
    Mars: "The Seven of Clubs is the card of the doubting mind, a mental fight you cannot win by force. Mars urges you to argue your way out today. Stop forcing the thought, the answer comes when you stop wrestling it.",
    Jupiter: "The Seven of Clubs is the card of the doubting mind, faith over worry. Jupiter rewards the trust today that anxiety called naive. Believe the better outcome, and watch the dread shrink as the day proves it small.",
    Saturn: "The Seven of Clubs is the card of the doubting mind, the long test of belief. Saturn sets a heavy uncertainty on you today, a doubt that wears. Endure it without bitterness, faith held under pressure is the only kind that counts.",
    Uranus: "The Seven of Clubs is the card of the doubting mind, certainty suddenly loosened. Uranus frees you today from a belief you clung to past its truth. Let it go, the mind opens only when it stops defending the old wall.",
    Neptune: "The Seven of Clubs is the card of the doubting mind, faith past the reach of proof. Neptune asks you to trust today what you cannot quite verify. Rest in the not-knowing, some truths are felt before they are shown."
  } },
  "8_clubs": { name: "Eight of Clubs", planets: {
    Mercury: "The Eight of Clubs is the card of the powerful mind, the word with force in it. Mercury sharpens your speech today, language that can move and persuade. Use the power to clarify, not to bludgeon.",
    Venus: "The Eight of Clubs is the card of the powerful mind, persuasion turned warm. Venus softens your influence today, a mind that wins by grace. Charm with the truth, and let no one feel cornered by your cleverness.",
    Mars: "The Eight of Clubs is the card of the powerful mind, the will behind the word. Mars wants the thought to dominate today, to overrun all argument. Press your point with strength, and stop short of crushing the other voice.",
    Jupiter: "The Eight of Clubs is the card of the powerful mind, influence that grows. Jupiter widens your reach today, your words carrying further than usual. Speak generously, the more good you broadcast the wider it travels.",
    Saturn: "The Eight of Clubs is the card of the powerful mind, strength put to use. Saturn asks your sharp mind to do hard, patient work today. Bend it to the difficult task, the power is for building and not for show.",
    Uranus: "The Eight of Clubs is the card of the powerful mind, a sudden brilliance. Uranus lights an idea in you today that startles even you. Let it through cleanly, do not grip it and do not perform it.",
    Neptune: "The Eight of Clubs is the card of the powerful mind, the word that travels far. Neptune sends your thought past the room today, to minds at a distance. Aim it true, what you broadcast lands further than you can see."
  } },
  "9_clubs": { name: "Nine of Clubs", planets: {
    Mercury: "The Nine of Clubs is the card of the wide mind, knowledge grown large enough to give away. Mercury brings word today that closes an old line of thought. Read it without clinging, the ending of an idea makes room for the next.",
    Venus: "The Nine of Clubs is the card of the wide mind, understanding come full. Venus asks you to share what you know today, freely and warmly. Teach the thing you have learned, it grows by being given.",
    Mars: "The Nine of Clubs is the card of the wide mind, the idea you must release. Mars demands you let go today of a belief past its life. Open the hand, what you grip out of habit is already dead.",
    Jupiter: "The Nine of Clubs is the card of the wide mind, knowledge overflowing. Jupiter sends more understanding than you can keep today. Spend it on the many, wisdom hoarded sours and wisdom shared multiplies.",
    Saturn: "The Nine of Clubs is the card of the wide mind, an idea laid to rest. Saturn asks you to let a long-held thought go cleanly today. Grieve it if you must, then feel the clarity the release leaves behind.",
    Uranus: "The Nine of Clubs is the card of the wide mind, a sudden completion of thought. Uranus closes a mental chapter for you today, abrupt and freeing. Let the surprise land, your head is clearer than it was this morning.",
    Neptune: "The Nine of Clubs is the card of the wide mind, the knower dissolving into the known. Neptune softens the edge between your thought and the larger truth today. Let the boundary blur, you lose nothing by belonging to a wider understanding."
  } },
  "10_clubs": { name: "Ten of Clubs", planets: {
    Mercury: "The Ten of Clubs is the card of the teeming mind, ideas arriving in number. Mercury floods you today, more thoughts than you can chase and most of them good. Catch the strongest few, you cannot ride every wave at once.",
    Venus: "The Ten of Clubs is the card of the teeming mind, learning shared in company. Venus makes the day social and bright with talk. Enjoy the crowd of ideas, and let the warmth of being understood lift you.",
    Mars: "The Ten of Clubs is the card of the teeming mind, the drive to master it all. Mars sharpens ambition today, the will to know the most and best. Push hard, and pick the worthy target before the energy scatters.",
    Jupiter: "The Ten of Clubs is the card of the teeming mind, knowledge multiplied. Jupiter returns your learning to you many times over today. Receive the abundance of a quick and full mind, and pass it on.",
    Saturn: "The Ten of Clubs is the card of the teeming mind, public knowing with a duty under it. Saturn ties the recognition to responsibility today. Wear the cleverness lightly, and keep faith with the truth beneath the applause.",
    Uranus: "The Ten of Clubs is the card of the teeming mind, a sudden flood of insight. Uranus opens the gates today, ideas pouring in from everywhere. Step into the rush, the unexpected mass of it formed for a reason.",
    Neptune: "The Ten of Clubs is the card of the teeming mind, knowledge from afar. Neptune brings learning today from distances and sources you cannot trace. Take the wide tide of it in, and let it carry your thinking outward."
  } },
  "J_clubs": { name: "Jack of Clubs", planets: {
    Mercury: "The Jack of Clubs is the card of the quick mind, the clever youth. Mercury races through this card today, wit fast and bright and a little mischievous. Use the sharpness to illuminate, not merely to score the point.",
    Venus: "The Jack of Clubs is the card of the quick mind, cleverness turned charming. Venus warms your wit today, a brightness that draws people in. Delight them with it, and keep the cleverness kind.",
    Mars: "The Jack of Clubs is the card of the quick mind, wit with an edge. Mars sharpens the tongue today, the urge to win every exchange. Be quick, be bold, and do not cut someone just to prove you can.",
    Jupiter: "The Jack of Clubs is the card of the quick mind, young brilliance widening. Jupiter opens your cleverness today onto bigger ground. Aim the wit at something worthy, the talent is meant for more than tricks.",
    Saturn: "The Jack of Clubs is the card of the quick mind, cleverness asked to do real work. Saturn sets a discipline on the bright young mind today. Slow the wit to a craft, brilliance without patience stays a trick.",
    Uranus: "The Jack of Clubs is the card of the quick mind, sudden invention. Uranus sparks the unexpected idea in you today, clever and strange. Catch it and run, the odd thought is the original one.",
    Neptune: "The Jack of Clubs is the card of the quick mind, wit reaching for the unseen. Neptune turns the cleverness toward mystery today, the puzzle behind the obvious. Follow the strange thread, the young mind senses what it cannot yet name."
  } },
  "Q_clubs": { name: "Queen of Clubs", planets: {
    Mercury: "The Queen of Clubs is the card of the knowing mind, intuition that mothers. Mercury sharpens that instinct into clear words today. Say the perceptive thing gently, you see more than you are letting on.",
    Venus: "The Queen of Clubs is the card of the knowing mind, wisdom flowing as care. Venus warms your insight today, knowledge offered as kindness. Share what you sense, and let yourself be understood in return.",
    Mars: "The Queen of Clubs is the card of the knowing mind, intuition turned fierce. Mars asks your insight to stand its ground today. Trust what you know and defend it, without grinding anyone under the certainty.",
    Jupiter: "The Queen of Clubs is the card of the knowing mind, wisdom that widens. Jupiter stretches your understanding today to hold more than usual. Open the knowing wide, there is enough insight in you to share around.",
    Saturn: "The Queen of Clubs is the card of the knowing mind, the wise one leaned on. Saturn brings someone's confusion to your steadiness today. Hold the clear view for them, and set the boundary that keeps you whole.",
    Uranus: "The Queen of Clubs is the card of the knowing mind, intuition struck sudden. Uranus flashes an unexpected knowing through you today. Trust the jolt of insight, it arrived ahead of the reasons for a reason.",
    Neptune: "The Queen of Clubs is the card of the knowing mind, intuition reaching far. Neptune deepens your sense today toward the unseen and the distant. Trust the quiet knowing, it reads what the eyes cannot."
  } },
  "K_clubs": { name: "King of Clubs", planets: {
    Mercury: "The King of Clubs is the card of the mastered mind, knowledge that rules. Mercury gives you the deciding word today, the clear thought that settles a muddle. Speak from understanding, and let the clarity organize the room.",
    Venus: "The King of Clubs is the card of the mastered mind, wisdom held in a sure hand. Venus warms your authority today, knowledge offered without arrogance. Lead by understanding, and make others feel safe to think near you.",
    Mars: "The King of Clubs is the card of the mastered mind, intellect and command at odds. Mars pulls knowing and force apart today. Rule the argument with reason, win the point without conquering the person.",
    Jupiter: "The King of Clubs is the card of the mastered mind, wisdom that leads. Jupiter lays the weight of leadership on your judgment today. Decide well, and let the soundness of your thinking set the standard.",
    Saturn: "The King of Clubs is the card of the mastered mind, mastery under load. Saturn tests your judgment today with a hard, weighty problem. Think it through without shortcut, the discipline is the whole of the mastery.",
    Uranus: "The King of Clubs is the card of the mastered mind, steadiness meeting a new idea. Uranus asks the master to revise today without losing center. Update the view, hold the core, lead the change with a clear head.",
    Neptune: "The King of Clubs is the card of the mastered mind, understanding that reaches far. Neptune extends your judgment today toward the unseen and the long view. Trust the wide reach of your thinking, it grasps more than the visible."
  } },
  "A_diamonds": { name: "Ace of Diamonds", planets: {
    Mercury: "The Ace of Diamonds is the card of new worth, ambition's first coin. Mercury turns the wanting into a plan today, a fresh idea about value or money. Write the figures down, the venture begins as a clear thought.",
    Venus: "The Ace of Diamonds is the card of new worth, the first reach for value. Venus ties the wanting to beauty today, a desire for something lovely and worth having. Want it openly, and spend on what genuinely enriches you.",
    Mars: "The Ace of Diamonds is the card of new worth, ambition newly lit. Mars puts drive behind the venture today, a hunger to earn and to act now. Make the bold move, but count the cost before you leap.",
    Jupiter: "The Ace of Diamonds is the card of new worth, the first seed of plenty. Jupiter is at home with this card and widens the prospect, a real chance at increase. Plant generously, the ground is willing today.",
    Saturn: "The Ace of Diamonds is the card of new worth, ambition meeting limit. Saturn sets a wall before the venture today, a value you cannot reach yet. Build slowly, the worth that lasts is laid one disciplined stone at a time.",
    Uranus: "The Ace of Diamonds is the card of new worth, opportunity arriving unannounced. Uranus makes the chance sudden today, a venture out of nowhere. Move fast on the strange opening, it knows something the forecast does not.",
    Neptune: "The Ace of Diamonds is the card of new worth, value sensed before it is seen. Neptune points the ambition today at something distant or not yet real. Follow the hunch, but keep your feet on the ground as you reach."
  } },
  "2_diamonds": { name: "Two of Diamonds", planets: {
    Mercury: "The Two of Diamonds is the card of the deal, value exchanged between two. Mercury works the terms today, a negotiation that turns on clear words. Say the numbers plainly, the fair deal is the honest one.",
    Venus: "The Two of Diamonds is the card of the deal, a partnership in worth. Venus warms the exchange today, a shared venture that feels like trust. Strike the bargain in good faith, and let both of you come away richer.",
    Mars: "The Two of Diamonds is the card of the deal, two sides at the table. Mars sharpens it to a contest today, a haggle with heat in it. Hold your line firmly, and close before the friction spoils the trade.",
    Jupiter: "The Two of Diamonds is the card of the deal, value grown by joining. Jupiter widens the partnership today, a shared venture worth more than the parts. Bring the other in, the deal multiplies what either could do alone.",
    Saturn: "The Two of Diamonds is the card of the deal, an agreement that must be earned. Saturn slows the bargain today, terms that take patience to settle. Read the fine print, the deal worth having survives a careful look.",
    Uranus: "The Two of Diamonds is the card of the deal, a sudden partnership in worth. Uranus brings the unexpected offer today, a venture that clicks into place fast. Trust the timing, the unplanned deal often pays the best.",
    Neptune: "The Two of Diamonds is the card of the deal, value traded across distance. Neptune carries the bargain far today, an arrangement with someone away. Trust the agreement, but get the terms in writing, the dream can blur."
  } },
  "3_diamonds": { name: "Three of Diamonds", planets: {
    Mercury: "The Three of Diamonds is the card of divided value, more ledgers than one mind can settle. Mercury scatters your accounting today, money pulling your thought several ways. Tally it on paper, the worry shrinks the moment the figures are real.",
    Venus: "The Three of Diamonds is the card of divided value, worth pulled many ways. Venus makes several purchases tempting today, none of them clearly wise. Spend on what truly enriches you, not on what merely glitters for a moment.",
    Mars: "The Three of Diamonds is the card of divided value, money at war with itself. Mars turns the strain to friction today, a financial worry that picks a fight. Choose one priority and fund it, the tension eases as you commit.",
    Jupiter: "The Three of Diamonds is the card of divided value, more opportunity than focus. Jupiter sends several ventures at once today, all of them plausible. Back the strongest one well rather than scattering across them all.",
    Saturn: "The Three of Diamonds is the card of divided value, money fear that circles. Saturn hardens the worry today, the same anxious sum repeating. Face the real number squarely, dread of it costs more than the figure itself.",
    Uranus: "The Three of Diamonds is the card of divided value, a budget split open. Uranus brings the unexpected cost or chance today, upsetting the plan. Let it reorder your figures, the surprise may be pointing at a better use.",
    Neptune: "The Three of Diamonds is the card of divided value, worth divided between here and far. Neptune draws your money mind toward the distant and the speculative today. Hold the ground you stand on, the far prospect can wait for clearer sight."
  } },
  "4_diamonds": { name: "Four of Diamonds", planets: {
    Mercury: "The Four of Diamonds is the card of settled value, worth on firm ground. Mercury brings word today that confirms your accounts, a number that holds. Take the certainty in, your footing is sounder than you feared.",
    Venus: "The Four of Diamonds is the card of settled value, the comfort of enough. Venus makes the security pleasant today, a steady worth that feels like ease. Enjoy what you have built, and stop straining for more than you need.",
    Mars: "The Four of Diamonds is the card of settled value, a holding kept firm. Mars sends a challenge to it today, something testing your security. Defend what is yours calmly, without turning the guarding into greed.",
    Jupiter: "The Four of Diamonds is the card of settled value, sound footing. Jupiter widens it today, your stable worth stretching to hold a little more. Build on the firm base, it will carry the added weight.",
    Saturn: "The Four of Diamonds is the card of settled value, the foundation of worth. Saturn tests that base today, pressing on what you have saved. What is solid will stand, so let the rest be examined without panic.",
    Uranus: "The Four of Diamonds is the card of settled value, a fixed holding. Uranus shakes it today, a change reaching into your secure place. Let the structure flex, a wealth that cannot move is already at risk.",
    Neptune: "The Four of Diamonds is the card of settled value, worth at rest. Neptune softens its edges today, security blurring toward something less certain. Hold what you have lightly, true safety was never only in the figure."
  } },
  "5_diamonds": { name: "Five of Diamonds", planets: {
    Mercury: "The Five of Diamonds is the card of restless value, worth that wants to move. Mercury speeds the schemes today, money ideas darting one to the next. Let them run, then pin down the single plan worth acting on.",
    Venus: "The Five of Diamonds is the card of restless value, the itch for a new venture. Venus makes the steady thing feel dull today and the new deal shine. Chase the fresh prospect if you must, without abandoning a sound thing half-done.",
    Mars: "The Five of Diamonds is the card of restless value, money that wants out. Mars charges the restlessness today, an urge to spend, move, or risk. Aim the drive at one real opportunity and put it to work there.",
    Jupiter: "The Five of Diamonds is the card of restless value, the field widening. Jupiter opens new ground today, more ways to earn than yesterday offered. Range generously, there is more here than you risk by moving.",
    Saturn: "The Five of Diamonds is the card of restless value, the wish to bolt from the budget. Saturn sets the steady duty in front of you today. Stay with the boring discipline, it is building exactly what the restlessness wants.",
    Uranus: "The Five of Diamonds is the card of restless value, the urge to overturn the plan. Uranus disrupts your finances today with something genuinely new. Let it shake things loose, the stale arrangement was due to change.",
    Neptune: "The Five of Diamonds is the card of restless value, worth drifting toward the far. Neptune fills the day with dreams of distant gain. Let the daydream run, then ask what real need is underneath the wanting."
  } },
  "6_diamonds": { name: "Six of Diamonds", planets: {
    Mercury: "The Six of Diamonds is the card of the fair exchange, value that balances its books. Mercury circles a money matter back for settling today. Square the account in plain figures, fairness is the whole of what is asked.",
    Venus: "The Six of Diamonds is the card of the fair exchange, worth returned to its level. Venus evens the books today, a chance to make a money matter right. Pay what you owe gladly, and let the balance restore the goodwill.",
    Mars: "The Six of Diamonds is the card of the fair exchange, a debt pressing to be paid. Mars pushes the reckoning today. Meet it with steadiness rather than resentment, and the account comes clear.",
    Jupiter: "The Six of Diamonds is the card of the fair exchange, value paid back. Jupiter returns what you once gave or invested, enriched. Receive it without suspicion, an honest exchange has simply come full circle.",
    Saturn: "The Six of Diamonds is the card of the fair exchange, the obligation you must honor. Saturn keeps a financial duty on you today. Pay it in full and on time, your good name is the real asset here.",
    Uranus: "The Six of Diamonds is the card of the fair exchange, accounts squared by surprise. Uranus settles a money matter abruptly today, in or out of your favor. Accept the rebalancing, it is correcting something overdue.",
    Neptune: "The Six of Diamonds is the card of the fair exchange, worth owed across distance. Neptune brings a long-due payment quietly home today. Trust the slow fairness of it, what is owed finds its way back."
  } },
  "7_diamonds": { name: "Seven of Diamonds", planets: {
    Mercury: "The Seven of Diamonds is the card of tested value, worth held against worry. Mercury lets money fear talk loudly today, every figure doubted. Hear it out, then trust the plan you made when your head was clear.",
    Venus: "The Seven of Diamonds is the card of tested value, security asked to soften its grip. Venus eases the money worry today with a gentler view. Loosen the clutch, what you hold too tightly brings no real peace.",
    Mars: "The Seven of Diamonds is the card of tested value, a financial fight you cannot force. Mars urges you to grab and grasp today. Stop chasing it, the worth you need arrives when you stop strangling it.",
    Jupiter: "The Seven of Diamonds is the card of tested value, faith over money fear. Jupiter rewards the trust today that anxiety called reckless. Believe in enough, and watch the lack prove smaller than it threatened.",
    Saturn: "The Seven of Diamonds is the card of tested value, the long discipline of worth. Saturn sets a financial strain on you today, a lean stretch to endure. Bear it without bitterness, the tight season passes sooner than it feels.",
    Uranus: "The Seven of Diamonds is the card of tested value, a grip suddenly loosened. Uranus frees you today from a holding you clutched past reason. Let it go, what you release on purpose makes room for better.",
    Neptune: "The Seven of Diamonds is the card of tested value, worth beyond what you can count. Neptune asks you to trust today what the ledger cannot show. Rest a little in the not-knowing, real security is not only a number."
  } },
  "8_diamonds": { name: "Eight of Diamonds", planets: {
    Mercury: "The Eight of Diamonds is the card of powerful value, worth with weight behind it. Mercury sharpens your money sense today, a clear eye for the sound deal. Use the shrewdness to build, not merely to take.",
    Venus: "The Eight of Diamonds is the card of powerful value, earning turned graceful. Venus warms your power today, prosperity that comes through goodwill. Earn by serving well, and let the wealth keep its warmth.",
    Mars: "The Eight of Diamonds is the card of powerful value, the drive behind the dollar. Mars wants the earning to dominate today, to push and acquire. Work hard for it, and do not let the getting harden you.",
    Jupiter: "The Eight of Diamonds is the card of powerful value, prosperity that grows. Jupiter widens your earning today, returns stretching beyond the usual. Put the surplus to work, money that moves makes more.",
    Saturn: "The Eight of Diamonds is the card of powerful value, strength set to the long task. Saturn asks your earning power to do patient work today. Bend it to the durable thing, the worth built slowly is the worth that holds.",
    Uranus: "The Eight of Diamonds is the card of powerful value, a sudden turn of fortune. Uranus jolts your finances today, an unexpected gain or shift. Let it move through cleanly, ride the change without gripping it.",
    Neptune: "The Eight of Diamonds is the card of powerful value, worth that reaches far. Neptune sends your earning past the room today, into ventures at a distance. Aim it true, and keep clear sight on what you cannot directly watch."
  } },
  "9_diamonds": { name: "Nine of Diamonds", planets: {
    Mercury: "The Nine of Diamonds is the card of wide value, wealth grown large enough to give away. Mercury brings word today that closes a financial chapter. Read it without clinging, the ending of one venture funds the next.",
    Venus: "The Nine of Diamonds is the card of wide value, worth come full. Venus asks the abundance to be shared today, not hoarded. Give from your plenty, generosity is wealth that finally knows its purpose.",
    Mars: "The Nine of Diamonds is the card of wide value, the holding you must release. Mars demands you let go today of money or a venture past its life. Open the hand, what you grip from fear is already slipping.",
    Jupiter: "The Nine of Diamonds is the card of wide value, abundance overflowing. Jupiter sends more than you can keep today. Spend it on the many, wealth held too close goes stale and wealth shared comes back around.",
    Saturn: "The Nine of Diamonds is the card of wide value, a loss to be met with grace. Saturn asks you to let a holding go cleanly today. Accept it without bitterness, and notice the freedom the lighter ledger brings.",
    Uranus: "The Nine of Diamonds is the card of wide value, a sudden settling of accounts. Uranus closes a money chapter abruptly today. Let the surprise land, your position is clearer than it was this morning.",
    Neptune: "The Nine of Diamonds is the card of wide value, worth dissolving into a larger good. Neptune softens your grip on having today. Loosen it, you lose nothing real by letting your wealth serve more than yourself."
  } },
  "10_diamonds": { name: "Ten of Diamonds", planets: {
    Mercury: "The Ten of Diamonds is the card of abundant value, the trader who knows worth and will not sell it cheap. Mercury turns that knowing into shrewd words today, a deal sharpened by a clear tongue. Name your price plainly, and let the figures speak for themselves.",
    Venus: "The Ten of Diamonds is the card of abundant value, the trader who knows worth. Venus warms the prosperity today, wealth that flows through goodwill and good taste. Spend on what is genuinely fine, and let your abundance be gracious.",
    Mars: "The Ten of Diamonds is the card of abundant value, the trader who refuses to sell cheap. Mars charges the ambition today, a hunger to earn big and win the trade. Drive hard for the worthy deal, and stop short of greed.",
    Jupiter: "The Ten of Diamonds is the card of abundant value, worth in full measure. Jupiter is doubly at home here today, prosperity widening on every side. Receive the increase openly, and let the plenty pass through your hands to others.",
    Saturn: "The Ten of Diamonds is the card of abundant value, the trader who knows worth and refuses to sell it cheap. Saturn sharpens that knowing into structure: today rewards the steady ledger over the lucky strike, the thing built to last over the thing that merely glitters. Name your price, honor your limits, and let what you create carry real weight.",
    Uranus: "The Ten of Diamonds is the card of abundant value, fortune in full. Uranus brings a sudden turn today, an unexpected windfall or shift in worth. Move quickly and lightly, ride the change without clutching at it.",
    Neptune: "The Ten of Diamonds is the card of abundant value, worth that reaches far. Neptune extends your prosperity today toward the distant and the unseen. Trust the wide reach, and keep clear eyes on the ventures you cannot directly watch."
  } },
  "J_diamonds": { name: "Jack of Diamonds", planets: {
    Mercury: "The Jack of Diamonds is the card of the young trader, sharp and quick with worth. Mercury races through this card today, a clever eye for the deal and the angle. Use the sharpness to make an honest profit, not a quick trick.",
    Venus: "The Jack of Diamonds is the card of the young trader, charm that sells. Venus warms your dealing today, a likeable knack for value. Win the trade by being genuinely liked, and keep the charm honest.",
    Mars: "The Jack of Diamonds is the card of the young trader, hungry and bold. Mars fires the ambition today, an urge to grab the gain now. Be quick and daring, and do not cut a corner you will pay for later.",
    Jupiter: "The Jack of Diamonds is the card of the young trader, opportunity widening. Jupiter opens the field today for a bright young venture. Aim higher than a fast buck, the talent is built for more than small wins.",
    Saturn: "The Jack of Diamonds is the card of the young trader, cleverness asked to mature. Saturn disciplines the quick deal today. Slow the hustle into real craft, sharpness without patience stays a gamble.",
    Uranus: "The Jack of Diamonds is the card of the young trader, a sudden clever opening. Uranus sparks an unexpected venture today, odd and promising. Seize the strange opportunity, the unusual deal is often the live one.",
    Neptune: "The Jack of Diamonds is the card of the young trader, an eye on the far horizon. Neptune turns the dealing toward the distant and the speculative today. Chase the vision if you like, but verify before you stake real coin."
  } },
  "Q_diamonds": { name: "Queen of Diamonds", planets: {
    Mercury: "The Queen of Diamonds is the card of the providing hand, worth that nurtures. Mercury sharpens your practical sense today, a clear head for what others need. Arrange the resources plainly, your provision is felt in the details.",
    Venus: "The Queen of Diamonds is the card of the providing hand, value given as care. Venus warms your generosity today, abundance shared with grace. Provide freely, and let yourself be provided for in turn.",
    Mars: "The Queen of Diamonds is the card of the providing hand, generosity turned fierce. Mars asks you to fight for someone's security today. Defend their share with strength, and keep the fierceness clean of control.",
    Jupiter: "The Queen of Diamonds is the card of the providing hand, plenty that widens. Jupiter stretches your means today to hold more than usual. Open the purse with an even hand, there is enough to go around.",
    Saturn: "The Queen of Diamonds is the card of the providing hand, the one others rely on. Saturn lays someone's material need against your steadiness today. Provide reliably, and set the limit that keeps your own well full.",
    Uranus: "The Queen of Diamonds is the card of the providing hand, care called to improvise. Uranus brings a sudden need today that no budget planned for. Meet it freshly, provision is a living act and not a fixed sum.",
    Neptune: "The Queen of Diamonds is the card of the providing hand, giving that reaches far. Neptune sends your generosity today toward the distant and the unseen in need. Give anyway, real provision crosses the distance and lands."
  } },
  "K_diamonds": { name: "King of Diamonds", planets: {
    Mercury: "The King of Diamonds is the card of mastered value, worth that rules. Mercury gives you the deciding word on a money matter today. Speak from clear figures, and let the soundness of the call settle the room.",
    Venus: "The King of Diamonds is the card of mastered value, wealth held in a sure hand. Venus warms your authority today, prosperity led with grace. Provide and decide warmly, and let your steadiness be the security others rest on.",
    Mars: "The King of Diamonds is the card of mastered value, command and worth at odds. Mars pulls money and force apart today. Rule the venture with judgment, win the deal without crushing the other side.",
    Jupiter: "The King of Diamonds is the card of mastered value, prosperity that leads. Jupiter lays the weight of leadership on your means today. Steward it well, and let the abundance you handle raise the standard for all.",
    Saturn: "The King of Diamonds is the card of mastered value, mastery under load. Saturn tests your judgment today with a heavy financial weight. Decide without shortcut, the patient, disciplined call is the masterful one.",
    Uranus: "The King of Diamonds is the card of mastered value, steadiness meeting a market shift. Uranus asks the master to adapt today without losing center. Adjust the plan, hold the principle, lead the change with a cool head.",
    Neptune: "The King of Diamonds is the card of mastered value, worth that reaches far. Neptune extends your command today over distant and unseen ventures. Trust the long reach of your judgment, and keep clear sight on what you cannot watch."
  } },
  "A_spades": { name: "Ace of Spades", planets: {
    Mercury: "The Ace of Spades is the card of the seeking will, ambition for the deepest thing. Mercury turns that hunger into a question today, the mind reaching for what is hidden. Ask the hard question, the answer you avoid is the one you need.",
    Venus: "The Ace of Spades is the card of the seeking will, the reach for the profound. Venus softens the search today, a love of the deep and the true. Pursue it gently, the most serious things open to a warm approach.",
    Mars: "The Ace of Spades is the card of the seeking will, ambition newly fierce. Mars puts force behind the work today, a drive to begin the hard thing now. Start it, the will is lit and the labor is yours to claim.",
    Jupiter: "The Ace of Spades is the card of the seeking will, a deep aim widening. Jupiter blesses the undertaking today, the great work given room to grow. Begin generously, the ground favors the serious effort now.",
    Saturn: "The Ace of Spades is the card of the seeking will, ambition meeting the long road. Saturn is at home with this card and sets the discipline today. Commit for the long haul, the deepest thing is built by patient labor and no shortcut.",
    Uranus: "The Ace of Spades is the card of the seeking will, the call arriving sudden. Uranus opens a hidden door today, a transformation you did not see coming. Walk through it, the strange summons knows where it leads.",
    Neptune: "The Ace of Spades is the card of the seeking will, the reach toward mystery itself. Neptune turns the ambition today to the unseen, the spirit behind the work. Follow the depth, this card has always belonged to the things beyond sight."
  } },
  "2_spades": { name: "Two of Spades", planets: {
    Mercury: "The Two of Spades is the card of joined labor, two at one task. Mercury coordinates the work today, an effort that turns on clear instruction. Say who does what plainly, the shared job runs on good communication.",
    Venus: "The Two of Spades is the card of joined labor, work shared in goodwill. Venus warms the partnership today, a task lightened by a willing companion. Work side by side in trust, and the labor itself becomes a bond.",
    Mars: "The Two of Spades is the card of joined labor, two wills on one task. Mars strikes friction today, a clash over how the work gets done. Pull together rather than against, and let the shared goal settle the method.",
    Jupiter: "The Two of Spades is the card of joined labor, effort doubled by joining. Jupiter widens the work today, more hands making a larger thing possible. Bring the other in, the task grows lighter as the circle grows.",
    Saturn: "The Two of Spades is the card of joined labor, a partnership that must be earned. Saturn tests the working bond today with strain or delay. Show up for the dull stretch, the alliance that survives the grind is the real one.",
    Uranus: "The Two of Spades is the card of joined labor, a sudden working pair. Uranus throws you together today with an unlikely collaborator. Trust the odd match, the unplanned partnership often does the best work.",
    Neptune: "The Two of Spades is the card of joined labor, work joined across distance. Neptune links the effort today with someone far. Trust the shared task, the bond of common work holds over any gap."
  } },
  "3_spades": { name: "Three of Spades", planets: {
    Mercury: "The Three of Spades is the card of divided labor, more work than one will can settle. Mercury scatters the tasks today, your effort pulled in too many directions. List them and rank them, the overwhelm shrinks once the work is on paper.",
    Venus: "The Three of Spades is the card of divided labor, effort pulled many ways. Venus asks you to choose the work that nourishes today over the work that merely fills time. Tend the task that matters, and let a lesser one wait.",
    Mars: "The Three of Spades is the card of divided labor, tasks at war for your hands. Mars turns the overload to friction today, a strain that frays the temper. Pick one job and finish it, the pressure eases as something gets done.",
    Jupiter: "The Three of Spades is the card of divided labor, more to do than focus allows. Jupiter piles on opportunity today, all of it worthwhile. Do one well rather than three poorly, the surplus is a luxury only if you choose.",
    Saturn: "The Three of Spades is the card of divided labor, worry that wears at the body. Saturn hardens the strain today into a knot of work-fear or fatigue. Name the real load plainly, and rest before the worry does the damage the work would not.",
    Uranus: "The Three of Spades is the card of divided labor, a plan split open. Uranus drops the unexpected task or setback today. Let it reorder your effort, the disruption may be clearing room for the work that counts.",
    Neptune: "The Three of Spades is the card of divided labor, effort divided between here and far. Neptune pulls your attention from the task toward the distant and the dreamed. Bring yourself back to the work in front of you, the far thing can wait."
  } },
  "4_spades": { name: "Four of Spades", planets: {
    Mercury: "The Four of Spades is the card of settled labor, rest the work has earned. Mercury brings word today that a task is truly done, a confirmation to lean on. Take it in, and let yourself actually stop.",
    Venus: "The Four of Spades is the card of settled labor, the ease after effort. Venus makes the rest sweet today, a peace your work has paid for. Enjoy the quiet, you are allowed to set the tools down.",
    Mars: "The Four of Spades is the card of settled labor, a hard-won stability. Mars sends something to disturb the rest today. Guard your recovery, and do not let restlessness drag you back to work too soon.",
    Jupiter: "The Four of Spades is the card of settled labor, secure ground beneath the work. Jupiter widens the stability today, your foundation holding more than before. Build on the solid base, the rest has made you ready.",
    Saturn: "The Four of Spades is the card of settled labor, the foundation effort built. Saturn tests that base today, pressing on what you have established. What was built well will stand, so trust it and shore up the rest.",
    Uranus: "The Four of Spades is the card of settled labor, a fixed routine. Uranus shakes the steady work today, a change reaching into the settled place. Let the method flex, a practice that cannot adapt is already failing.",
    Neptune: "The Four of Spades is the card of settled labor, rest that runs deep. Neptune softens the edges of effort today, the body asking for true stillness. Give it the deep rest, restoration is its own quiet work."
  } },
  "5_spades": { name: "Five of Spades", planets: {
    Mercury: "The Five of Spades is the card of restless labor, work that wants new ground. Mercury speeds the urge to change tack today, plans for a different task. Let the ideas move, then commit to one before the day scatters.",
    Venus: "The Five of Spades is the card of restless labor, the itch to leave the work. Venus makes the current task feel stale today and the new one shine. Move on if you must, without walking out on something nearly finished.",
    Mars: "The Five of Spades is the card of restless labor, effort that wants out. Mars charges the restlessness today, a need to break from the grind. Spend it in real motion, change the scene, then return to the work renewed.",
    Jupiter: "The Five of Spades is the card of restless labor, the field widening. Jupiter opens new work today, more directions than yesterday offered. Range generously, there is more to gain here than the comfort you would keep.",
    Saturn: "The Five of Spades is the card of restless labor, the wish to quit the task. Saturn sets the unfinished duty in front of you today. Stay with it, the discipline you resist is the one that finishes the thing.",
    Uranus: "The Five of Spades is the card of restless labor, the urge to overturn the work. Uranus disrupts the routine today with something genuinely new. Let it break the rut, the stale way of working was overdue to go.",
    Neptune: "The Five of Spades is the card of restless labor, effort drifting toward escape. Neptune fills the day with longing to be anywhere but the task. Let the daydream pass, then ask what the work is really lacking."
  } },
  "6_spades": { name: "Six of Spades", planets: {
    Mercury: "The Six of Spades is the card of the carried burden, labor that must be borne. Mercury circles a duty back to you today, a task you cannot delegate. Take it up plainly, and do the next right thing without dramatizing the weight.",
    Venus: "The Six of Spades is the card of the carried burden, duty met with grace. Venus eases the load today, a heavy task softened by good company or willing heart. Carry it gently, the burden shared is half a burden.",
    Mars: "The Six of Spades is the card of the carried burden, the work pressing to be done. Mars pushes the obligation today. Meet it with steady strength rather than complaint, and the weight moves.",
    Jupiter: "The Six of Spades is the card of the carried burden, effort that pays back. Jupiter returns the fruit of work you once did, earned and overdue. Receive it without protest, the labor is simply coming full circle.",
    Saturn: "The Six of Spades is the card of the carried burden, the duty you cannot set down. Saturn is heavy on this card today, a responsibility fixed to your shoulders. Carry it well, this steady weight is what makes you trusted.",
    Uranus: "The Six of Spades is the card of the carried burden, fate rearranging the load. Uranus shifts your obligations suddenly today. Let the burden be redistributed, the change is correcting something long out of balance.",
    Neptune: "The Six of Spades is the card of the carried burden, a duty owed across distance. Neptune brings a long-standing obligation quietly due today. Honor it, the slow accounting of work always finds its way home."
  } },
  "7_spades": { name: "Seven of Spades", planets: {
    Mercury: "The Seven of Spades is the card of the tested will, the soul's hard labor. Mercury lets discouragement talk loudly today, every effort doubted. Hear it out, then keep working from what you know, not what you fear.",
    Venus: "The Seven of Spades is the card of the tested will, hardship asked to soften. Venus brings a gentler strength today, the labor eased by a kinder view of yourself. Be tender with your struggle, harshness only adds to the weight.",
    Mars: "The Seven of Spades is the card of the tested will, a fight you cannot win by force. Mars urges you to push harder today against an immovable thing. Stop forcing it, conserve the strength, and let the obstacle teach its patience.",
    Jupiter: "The Seven of Spades is the card of the tested will, faith over despair. Jupiter rewards the trust today that exhaustion called foolish. Hold on, and watch the wall prove lower than it looked from your knees.",
    Saturn: "The Seven of Spades is the card of the tested will, the long ordeal. Saturn sets real endurance on you today, a hardship of work or health to be borne. Bear it without bitterness, and pace yourself, it is shorter than it feels.",
    Uranus: "The Seven of Spades is the card of the tested will, a sudden release from struggle. Uranus loosens the grip today on a hardship you held too long. Let it go, the relief you did not plan for is real, take it.",
    Neptune: "The Seven of Spades is the card of the tested will, faith past the reach of proof. Neptune asks you to trust today a labor whose meaning you cannot yet see. Keep at it in the dark, you are held even where the way is unclear."
  } },
  "8_spades": { name: "Eight of Spades", planets: {
    Mercury: "The Eight of Spades is the card of the powerful will, labor with force in it. Mercury sharpens your focus today, a mind that can drive a task to its end. Use the power deliberately, and aim it at the work that matters most.",
    Venus: "The Eight of Spades is the card of the powerful will, strength turned gentle. Venus warms your force today, power that serves rather than dominates. Apply it with care, the strongest will is the one that knows restraint.",
    Mars: "The Eight of Spades is the card of the powerful will, raw drive. Mars is fierce on this card today, a strength that wants to overpower the task and everyone near it. Push hard, and watch that the force does not become a hammer for its own sake.",
    Jupiter: "The Eight of Spades is the card of the powerful will, strength that grows. Jupiter widens your capacity today, more able to do and to endure. Spend the power generously, used well it expands.",
    Saturn: "The Eight of Spades is the card of the powerful will, force set to the long task. Saturn asks your strength to do patient, grinding work today. Bend it to the durable thing, the will proves itself in endurance, not in show.",
    Uranus: "The Eight of Spades is the card of the powerful will, a sudden surge of strength. Uranus jolts your drive today, an energy that arrives from nowhere. Let it move through cleanly, ride the surge without letting it ride you.",
    Neptune: "The Eight of Spades is the card of the powerful will, strength that reaches far. Neptune sends your influence past the room today, your effort felt at a distance. Aim it true, the force you exert travels further than you see."
  } },
  "9_spades": { name: "Nine of Spades", planets: {
    Mercury: "The Nine of Spades is the card of the great ending, the will that lets go. Mercury brings word today that something is finished, a chapter closing for good. Read it without flinching, an honest ending is the start of the next true thing.",
    Venus: "The Nine of Spades is the card of the great ending, release made gentle. Venus softens the loss today, a goodbye that need not be bitter. Let it go with love, what ends in grace leaves room for grace to come.",
    Mars: "The Nine of Spades is the card of the great ending, the grip you must finally break. Mars demands you release today what is already gone. Open the hand, fighting the ending only bloodies you against the inevitable.",
    Jupiter: "The Nine of Spades is the card of the great ending, the wide clearing. Jupiter widens the release today, a letting-go that opens real space. Give it up generously, what you free makes room for something larger.",
    Saturn: "The Nine of Spades is the card of the great ending, the loss to be met with dignity. Saturn brings the final settling today, the close of a long matter. Grieve it cleanly, accept what is finished, and let the weight lift.",
    Uranus: "The Nine of Spades is the card of the great ending, an abrupt completion. Uranus cuts the cord suddenly today, an ending you did not choose. Let the shock pass through, the clearing it leaves is real and it is yours.",
    Neptune: "The Nine of Spades is the card of the great ending, the self dissolving into something larger. Neptune softens the boundary today between holding on and letting go. Release it into the deep, nothing true is ever actually lost."
  } },
  "10_spades": { name: "Ten of Spades", planets: {
    Mercury: "The Ten of Spades is the card of teeming labor, work arriving in number. Mercury floods you with tasks today, more than one mind can track at once. Write them down and take them in order, the mountain moves one clear step at a time.",
    Venus: "The Ten of Spades is the card of teeming labor, effort shared in company. Venus makes the heavy work lighter today through good company. Lean on the team, and let the warmth of doing it together carry you.",
    Mars: "The Ten of Spades is the card of teeming labor, the drive to achieve it all. Mars sharpens ambition today, the will to finish the whole great pile. Push hard, and choose the vital tasks before the energy spreads too thin.",
    Jupiter: "The Ten of Spades is the card of teeming labor, work rewarded in full. Jupiter returns your effort to you many times over today. Receive the achievement openly, and share the credit with the hands that helped.",
    Saturn: "The Ten of Spades is the card of teeming labor, accomplishment with a duty under it. Saturn ties the success to responsibility today. Carry the load without grinding yourself down, and pace the great work for the long haul.",
    Uranus: "The Ten of Spades is the card of teeming labor, a sudden surge of work. Uranus opens the floodgates today, demands pouring in from everywhere. Step into the rush, the great push formed around you for a reason.",
    Neptune: "The Ten of Spades is the card of teeming labor, work whose end you cannot yet see. Neptune blurs the finish line today, the task feeling vast and vague. Trust the effort anyway, do the next piece, the far end arrives as you walk."
  } },
  "J_spades": { name: "Jack of Spades", planets: {
    Mercury: "The Jack of Spades is the card of the apprentice will, the youth at hard work. Mercury quickens a clever approach to the labor today, a smart way through the grind. Use the wit to work smarter, then put in the hours it still demands.",
    Venus: "The Jack of Spades is the card of the apprentice will, effort offered with heart. Venus warms the young worker today, a labor done for love of the craft. Give yourself to it gladly, and keep a little ease for yourself.",
    Mars: "The Jack of Spades is the card of the apprentice will, eager and untested strength. Mars fires the drive today, the urge to prove yourself through work. Throw yourself in, and watch that the boldness does not outrun the skill.",
    Jupiter: "The Jack of Spades is the card of the apprentice will, young effort widening. Jupiter opens the craft today onto bigger ground. Aim past the small task, the talent is meant to grow into real mastery.",
    Saturn: "The Jack of Spades is the card of the apprentice will, eagerness asked to mature. Saturn sets the long discipline on you today. Trade the quick result for true craft, the apprentice becomes the master only through patience.",
    Uranus: "The Jack of Spades is the card of the apprentice will, a sudden new method. Uranus sparks an unexpected way of working today, odd and effective. Try the strange approach, the original method is often the apprentice's gift.",
    Neptune: "The Jack of Spades is the card of the apprentice will, work reaching toward the unseen. Neptune turns the labor today toward the subtle, the artful, the spiritual. Follow the deeper pull, the young hand senses a craft it cannot yet name."
  } },
  "Q_spades": { name: "Queen of Spades", planets: {
    Mercury: "The Queen of Spades is the card of laboring wisdom, the one who has done the work. Mercury sharpens your hard-won knowing into clear words today. Say the seasoned thing plainly, you have earned the right to be heard.",
    Venus: "The Queen of Spades is the card of laboring wisdom, strength carried with grace. Venus warms your competence today, mastery offered as care. Help with your skill, and let your steadiness reassure the ones who lean in.",
    Mars: "The Queen of Spades is the card of laboring wisdom, hard knowing turned fierce. Mars asks your experience to stand firm today. Defend what your labor taught you, and wield the authority without contempt for the green.",
    Jupiter: "The Queen of Spades is the card of laboring wisdom, mastery that widens. Jupiter stretches your capability today to carry more than usual. Take on the larger work, your seasoned hands are equal to it.",
    Saturn: "The Queen of Spades is the card of laboring wisdom, the strong one leaned on. Saturn lays real weight on your competence today. Carry it steadily, and set the boundary that keeps even the capable from breaking.",
    Uranus: "The Queen of Spades is the card of laboring wisdom, skill asked to improvise. Uranus brings a problem today that your old methods do not fit. Adapt on the spot, true mastery shows most in the unplanned moment.",
    Neptune: "The Queen of Spades is the card of laboring wisdom, knowing that reaches the unseen. Neptune deepens your insight today toward the subtle and the spiritual. Trust the quiet wisdom your work has earned, it reads what others miss."
  } },
  "K_spades": { name: "King of Spades", planets: {
    Mercury: "The King of Spades is the card of mastered will, wisdom that rules. Mercury gives you the decisive word today, the hard-earned judgment that cuts through. Speak from experience, and let the authority of real knowing settle the matter.",
    Venus: "The King of Spades is the card of mastered will, power held with grace. Venus warms your command today, mastery that leads without cruelty. Rule the work warmly, and let your steadiness be the ground others build on.",
    Mars: "The King of Spades is the card of mastered will, command and force at odds. Mars pulls strength and wisdom apart today. Govern the hard task with judgment, drive the work without becoming a tyrant over it.",
    Jupiter: "The King of Spades is the card of mastered will, mastery that leads. Jupiter lays the weight of leadership on your seasoned judgment today. Decide well, and let the depth of your experience raise everyone around you.",
    Saturn: "The King of Spades is the card of mastered will, mastery under full load. Saturn is at home on this highest card today, testing your strength with real weight. Carry it without shortcut, the discipline is the whole of the kingship.",
    Uranus: "The King of Spades is the card of mastered will, steadiness meeting upheaval. Uranus asks the master to adapt today without losing center. Change the method, hold the principle, and lead the disruption with a calm, sure hand.",
    Neptune: "The King of Spades is the card of mastered will, authority that reaches the unseen. Neptune extends your wisdom today toward the deepest and most distant things. Trust the long reach of your knowing, it governs more than the visible world."
  } }
};
