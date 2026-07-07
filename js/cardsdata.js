// cardsdata.js — shared card data and popup logic
// Used by: cardsoflife.html, iching.html, astrology.html
// (Retired pages quadrations.html / freecell.html also load it; see dev/retired-pages/.)
// Pattern: same as ichingdata.js / linedata.js

// ── Suit pip glyphs ────────────────────────────────────────────────
// All four suits are drawn as inline SVG so the deck's pips share one
// hand-drawn set (and so the same shapes can be engraved into the homepage
// coin). Fill is currentColor, so each pip takes its suit colour from the
// card face (hearts/diamonds red, clubs/spades dark). Kept in sync with the
// mirror in js/casting.js (the homepage doesn't load this file).
window.SUIT_PIP_SVG = {
  '♠': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,8 C30,26 6,50 6,66 C6,82 22,90 36,82 C42,78 47,74 50,70 L40,95 L60,95 L50,70 C53,74 58,78 64,82 C78,90 94,82 94,66 C94,50 70,26 50,8 Z"/></svg>',
  '♥': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,86 C45,79 15,58 15,34 C15,22 24,14 35,14 C43,14 48,20 50,27 C52,20 57,14 65,14 C76,14 85,22 85,34 C85,58 55,79 50,86 Z"/></svg>',
  '♦': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,6 L86,50 L50,94 L14,50 Z"/></svg>',
  '♣': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="30" r="20"/><circle cx="27" cy="58" r="20"/><circle cx="73" cy="58" r="20"/><path d="M44,46 L40,96 L60,96 L56,46 Z"/></svg>'
};
window.pipMark = function (sym) { return window.SUIT_PIP_SVG[sym] || sym; };

// ── Card Data ──────────────────────────────────────────────────────
const CARDS = [
  // HEARTS
  { rank:'A',  suit:'hearts',   sym:'♥', name:'Ace of Hearts',    dates:'Dec 30',
    teaser:'The very first beat of the deck, and its oldest hunger: the need to love and to be loved in return. Magnetic and quick to read the true worth of things, you spend a lifetime learning whether the heart and worldly success can ever be held at once.',
    kws:['Desire','New beginnings','Emotional depth','Self-discovery'],
    personality:'The desire for love sits at the very root of this card, the first beat of the Hearts suit and of the deck itself. A soul of intense longing and magnetic warmth, you are driven by a deep need to love and to be loved in return, and you instinctively want to know the true value and worth of everything before you. You carry a rare emotional intelligence, a quick and ambitious mind, and a real gift for both people and business; many born to this card thrive in the arts or in competitive arenas. The tension between the love of the heart and the love of worldly success is your great teacher, and the quiet truth of this card is that you can have both.',
    strengths:['Intense, devoted love','Magnetic and emotionally intelligent','Ambitious and quick-minded','Sees potential in people before others do'],
    challenges:['The longing to be loved can tip into dependency','Emotional overwhelm','Difficulty detaching from people or outcomes','Balancing the pull between love and material success'] },
  { rank:'2',  suit:'hearts',   sym:'♥', name:'Two of Hearts',    dates:'Dec 29',
    teaser:'The Lovers of the deck, a soul wired for deep connection and almost spiritual about what partnership could be. Your ideals of love run so high they become the very thing you struggle to live up to.',
    kws:['Union','Partnership','Devotion','Idealism'],
    personality:'Union is the whole story of this card, the Lovers of the deck. A soul wired for deep connection, you carry an almost spiritual vision of what love and partnership can be, drawn to union not just romantically but philosophically, and seeking harmony in every relationship you touch. You are sensitive and profoundly affected by your surroundings and by how others treat you, with a genuine need for support and acknowledgment, and you nearly always prefer partnership to going it alone. Your desire for a true soul mate is one of the strongest motivators behind the choices you make. Your greatest gift is also your greatest tension: your ideals of love run so high they can be difficult to live up to, even for yourself.',
    strengths:['Deep loyalty and devoted love','Natural peacemaker with a gift for harmony','Powerful intuition about people and relationships','Ability to nurture and sustain bonds over time'],
    challenges:['Unrealistic ideals leading to repeated disappointment','Fear of being alone driving compromised choices','Can feel profoundly misunderstood by others'] },
  { rank:'3',  suit:'hearts',   sym:'♥', name:'Three of Hearts',  dates:'Nov 30, Dec 28',
    teaser:'Love and imagination running on the same current, an expressive heart paired with a restless, brilliant mind. The gift is real feeling poured into art and words; the catch is scattering it across too many beginnings that never find an ending.',
    kws:['Creativity','Expression','Versatility','Restlessness'],
    personality:'Love and imagination are the twin engines of this card. A naturally gifted communicator and creator, you move through the world with an expressive heart and a restless, brilliant mind, blessed with the ability to channel deep feeling into art, words, or performance. You are imaginative, optimistic and social, and at your best you inspire others simply by sharing your inner life openly and honestly. Your feelings run deeper than those around you often realise. The shadow is a tendency to scatter that creative force across too many directions at once, leaving inspired beginnings without satisfying endings; moodiness, worry and indecision are usually signs that your creativity needs a productive channel to flow into.',
    strengths:['Artistic and richly expressive','Persistent and self-motivated when passion is engaged','Warm, entertaining social presence','Wide range of creative talents'],
    challenges:['Scattered energy and creative indecision','Emotional restlessness in relationships','Persistent worry and mental chatter'] },
  { rank:'4',  suit:'hearts',   sym:'♥', name:'Four of Hearts',   dates:'Oct 31, Nov 29, Dec 27',
    teaser:'The builder of the Hearts suit, quietly devoted to creating a home and a love that others can lean on. The same steadiness that makes you safe to love can harden into a resistance to the changes you actually need.',
    kws:['Stability','Security','Loyalty','Home'],
    personality:'This is the card of foundations, the builder of the Hearts suit. You seek to create lasting emotional security and a home life others can depend on, and being deeply loyal and consistent, you offer the people you love a rare sense of groundedness and safety. Harmony in your relationships is essential to your happiness, and you do your best work alongside others who share your values. Many born to this card are natural healers and find real success in business, education, the arts, medicine, or metaphysics once they are happy in themselves. The challenge lies in rigidity; the very stability you instinctively build can harden into resistance to the changes that are not only inevitable but necessary.',
    strengths:['Unwavering loyalty and reliability','Natural protector and homemaker','Emotional consistency others can trust','Practical and grounded in relationships'],
    challenges:['Stubbornness and resistance to change','Fear of instability leading to controlling behaviour','Difficulty adapting when circumstances shift unexpectedly'] },
  { rank:'5',  suit:'hearts',   sym:'♥', name:'Five of Hearts',   dates:'Oct 30, Nov 28, Dec 26',
    teaser:'The restless heart that wants all of it at once, love, security, variety, and a horizon to chase. Your whole reward in life is hidden in one hard thing: finding something you love and staying long enough to watch it bloom.',
    kws:['Freedom','Change','Adventure','Restlessness'],
    personality:'The restless heart wants it all, love, money, security and variety, and this is the card of emotional adventure. A seeker by nature, you are drawn to new experiences, new people, and new emotional horizons, carrying an infectious energy and curiosity that makes life feel alive wherever you go. You are highly sociable, have a good head for business, and thrive in work that offers travel, variety, and the chance to advise or be among people. The shadow is a restlessness that can make commitment feel like a cage and pull your focus before depth is reached. The great work of your life, and its greatest reward, is finding something you truly love and staying with it long enough to see it bloom.',
    strengths:['Adventurous and enthusiastically open-hearted','Highly adaptable and energetic','Magnetic and engaging social presence','Able to reinvent yourself across many stages of life'],
    challenges:['Emotional restlessness and inconsistency in love','Difficulty sustaining long-term commitment','Tendency to move on before depth is reached'] },
  { rank:'6',  suit:'hearts',   sym:'♥', name:'Six of Hearts',    dates:'Oct 29, Nov 27, Dec 25',
    teaser:'The card of karmic love, forever smoothing conflict and healing the people around you, often at your own expense. Love returned is love earned here, and the one key you keep circling back to is simply taking action.',
    kws:['Karma','Responsibility','Compassion','Peace'],
    personality:'Balance and harmony are this card\'s whole pursuit, the energy of karmic love. You understand at a deep level that relationships are the great classroom of life, and being naturally kind, affectionate and sensitive to the feelings of others, you are forever drawn to smooth conflict and heal wounds, often sacrificing your own needs for the happiness of those you love. You have genuine mental balance and good judgment to draw on, alongside high intelligence and a real gift for communication. The lesson of this card is accountability: love returned is love earned, and what you receive mirrors what you give. The single key to your success is action, the conscious choice to move past a natural tendency to procrastinate.',
    strengths:['Deep compassion and genuine empathy','Natural peacemaker and skilled mediator','Strong sense of responsibility toward those you love','Emotionally wise beyond your years'],
    challenges:['Taking on others\' emotional burdens as your own','Avoiding necessary conflict in the name of peace','Resistance to accepting karmic lessons on their own terms'] },
  { rank:'7',  suit:'hearts',   sym:'♥', name:'Seven of Hearts',  dates:'Sep 30, Oct 28, Nov 26, Dec 24',
    teaser:'The Mystic Heart, tuned to a high frequency and able to read the inner worlds of others with rare accuracy. Beauty keeps you well and giving keeps you alive, but the quiet danger is the martyrdom that grows when you give without ever being filled back up.',
    kws:['Spirituality','Intuition','Forgiveness','Inner life'],
    personality:'Known as the Mystic Heart, the card of truth and beauty, this is one of the most spiritually charged cards in the deck. You operate on a high emotional frequency, gifted with deep intuition and a rare ability to understand the inner worlds of others, which is why so many born to this card become counsellors, healers, and teachers. Your path is one of spiritual love and forgiveness: learning to give freely and forgive fully, while guarding against the martyrdom that quietly grows from over-giving without replenishment. Beauty and harmony are the keys to your peace of mind, so surround yourself with them, and find the balance between giving and receiving that lets your own needs be met too.',
    strengths:['Profound emotional and spiritual intelligence','Natural healer, counsellor, or teacher','Magnetic and charismatic presence','Deep and genuine capacity for forgiveness'],
    challenges:['Over-sensitivity and emotional overwhelm','Risk of self-sacrifice tipping into martyrdom','Suspicion or jealousy in close relationships when depleted'] },
  { rank:'8',  suit:'hearts',   sym:'♥', name:'Eight of Hearts',  dates:'Aug 31, Sep 29, Oct 27, Nov 25, Dec 23',
    teaser:'Here love stops being soft and becomes a force, healing, magnetic, and asking to be used with real integrity. Your deepest work is self-love, because everything you draw toward you rests on that one foundation.',
    kws:['Self-love','Emotional power','Healing','Transformation'],
    personality:'Here love is a force, not merely romantic but healing and transformative, expressed through magnetic charm and a real strength of character. You have been blessed with the kind of emotional power that asks to be used with integrity, and you can attain genuine mastery in almost any field you choose, particularly the arts, music, healing, or work as a counsellor or teacher. Your greatest work is the cultivation of deep self-love, and through that inner foundation you naturally draw powerful, meaningful connections toward you. The shadow is the misuse of that emotional power: when love tips into possessiveness, or strength becomes a refusal to be vulnerable. A tendency to worry is the quiet tax this card asks you to manage.',
    strengths:['Magnetic personal warmth and emotional authority','Deep capacity for emotional healing and renewal','Self-aware and genuinely introspective','Resilient and steady through relational challenges'],
    challenges:['Power struggles within intimate relationships','Possessiveness or need for emotional control','Difficulty allowing true vulnerability'] },
  { rank:'9',  suit:'hearts',   sym:'♥', name:'Nine of Hearts',   dates:'Aug 30, Sep 28, Oct 26, Nov 24, Dec 22',
    teaser:'One of the most emotionally profound cards in the deck, the place where love is learned by giving more than most know how to receive. They call it the wish card, and its whole lesson is the hardest one: learning to let go, of people, of outcomes, of the need to hold love to prove it is real.',
    kws:['Completion','Universal love','Generosity','Release'],
    personality:'Universal love and the completion of the emotional cycle live in this card, one of the most emotionally profound in the deck and known as the card of learning through love. You love deeply and give generously, often more than others know how to match or receive, and the bulk of your lessons arrive through your relationships, where cultivating discernment becomes the work of a lifetime. This is also the \'wish\' card; you can spend years wishing for love or for money, and the life lesson is learning to release, people, outcomes, and the idea that love must be held to be real. What you give to the world returns magnified, but only once you stop gripping it. Note: the 9 of Hearts is a semi-fixed card and Spiritual Twin to the 7 of Diamonds.',
    strengths:['Immense and genuine capacity for love and generosity','Deeply empathetic and emotionally wise','Naturally inspiring and magnetic','Called toward service in a meaningful and lasting way'],
    challenges:['Emotional depletion from chronic over-giving','Idealism cycling into disillusionment','Difficulty with endings, loss, and letting go'] },
  { rank:'10', suit:'hearts',   sym:'♥', name:'Ten of Hearts',    dates:'Jul 31, Aug 29, Sep 27, Oct 25, Nov 23, Dec 21',
    teaser:'Love turned outward and lit up for a crowd, warmth that can move a whole room at once. The shadow is subtle: magnificent in public, you can quietly withdraw from the real intimacy that happens in private.',
    kws:['Abundance','Social love','Ambition','Success'],
    personality:'The highest-value card in the Hearts suit carries the energy of love expressed outwardly and abundantly, with a strong, independent spirit that instinctively knows every obstacle can be met through love and understanding. You thrive in social settings, on a stage, or in any role where your warmth and emotional intelligence can move many people at once, and your powers of reason and logic, once applied, are formidable. Living the fullness of this card brings success romantically, spiritually and materially; living below it invites doubt, confusion, and a slide toward the domineering. The shadow is a tendency to withdraw from genuine intimacy while remaining magnificent in the crowd. Real vulnerability, offered in private, is your growing edge.',
    strengths:['Naturally charismatic and emotionally generous','Gifted at connecting with and inspiring large groups','Ambitious with penetrating emotional focus','Warm, magnanimous spirit'],
    challenges:['Emotional distance or guardedness in intimate relationships','Risk of isolation behind a polished public persona','Need for recognition can overshadow authentic connection'] },
  { rank:'J',  suit:'hearts',   sym:'♥', name:'Jack of Hearts',   dates:'Jul 30, Aug 28, Sep 26, Oct 24, Nov 22, Dec 20',
    teaser:'Eternal youth and a giving heart, the natural teacher who shows the way of love by example, often from somewhere behind the scenes. Beloved almost everywhere you go, your secret task is to give some of that devotion back to yourself.',
    kws:['Charm','Service','Youthfulness','Idealism'],
    personality:'Eternal youth and sacrificial love meet in this card, the natural-born teacher who came to show the way of love and compassion, often by example and frequently from behind the scenes. Charismatic, warm, and beloved in nearly every room you enter, you carry a rare combination of personal magnetism and genuine care, and you understand instinctively that the greatest gift is the giving of oneself. The shadow is the classic resistance of the Knave: charm and good intentions are no substitute for showing up fully, and carelessness or denial can shade into escapism. The secret, easily missed by so giving a soul, is to give to yourself too, honouring your own dreams and keeping clear boundaries. Note: the Jack of Hearts is a fixed card in the Life Spread.',
    strengths:['Irresistible personal magnetism and natural warmth','Genuine compassion and desire to be of service','Creative, playful, and energising to others','Natural leader who inspires through love rather than authority'],
    challenges:['Avoiding responsibility or emotional depth','Charm used as deflection from difficult truths','Inconsistency or restlessness in committed relationships'] },
  { rank:'Q',  suit:'hearts',   sym:'♥', name:'Queen of Hearts',  dates:'Jul 29, Aug 27, Sep 25, Oct 23, Nov 21, Dec 19',
    teaser:'The promoter of dreams and the deck\'s image of unconditional love, holding a vision of harmony wide enough to take in people, animals, art, and spirit alike. The trouble is the one direction the love rarely flows: inward, toward the Queen herself.',
    kws:['Nurturing','Unconditional love','Artistry','Devotion'],
    personality:'The promoter of dreams and the archetype of unconditional love, this Queen holds a vision of love and harmony for the whole world. Nurturing, devoted, and deeply invested in the flourishing of those around her, you are inviting, warm, optimistic and artistically gifted, with an emotional capacity broad enough to extend beyond people to animals, art, nature, and the spiritual life. Your remarkable communication skills and magnetic personality suit you to teaching, management, or any role rich in contact with people; many born to this card are natural psychics and mediums. The challenge is ensuring all this love flows inward as well, for the Queen who perpetually gives without ever receiving cannot sustain the very love that defines her.',
    strengths:['Vast and genuine capacity for unconditional love','Naturally gifted in the arts and creative expression','Emotionally steady and sustaining in relationships','Devoted, consistent, and deeply caring'],
    challenges:['Neglecting self-care in service of others','Attempting to sustain relationships that have run their course','Taking on emotional weight that belongs to someone else'] },
  { rank:'K',  suit:'hearts',   sym:'♥', name:'King of Hearts',   dates:'Jul 28, Aug 26, Sep 24, Oct 22, Nov 20, Dec 18',
    teaser:'The master of love, ruling by warmth rather than force and most himself when his actions bless the people around him. Watch for the quiet pile of disappointment that gathers when others fall short of you, because left alone it hardens into the very distance you stand against.',
    kws:['Wisdom','Mastery','Authority','Love'],
    personality:'The master of love rules his kingdom by love rather than dominance, and is most himself when his deeds bring blessing to others. You carry a rare, hard-won combination of emotional wisdom and practical intelligence, gravitating naturally toward leadership, teaching, or guidance; others sense your authority without your ever needing to announce it, for you hold your power in the silence of your knowing and are happy to let others take the glory. Within you lives a real source of inspiration and creative expression. The shadow is the quiet accumulation of disappointment when others fail to meet your expectations, which, left unexamined, can harden into guardedness and an emotional distance that contradicts everything you stand for.',
    strengths:['Emotionally wise and naturally authoritative','Gifted teacher, leader, or counsellor','Intellectually sharp with deep intuitive read of people','Loyal, principled, and magnetically trustworthy'],
    challenges:['Disappointment in others leading to emotional guardedness','Difficulty showing genuine vulnerability','Setting expectations that become impossible standards'] },

  // CLUBS
  { rank:'A',  suit:'clubs',    sym:'♣', name:'Ace of Clubs',     dates:'Dec 17',
    teaser:'The brightest, most restless mind in the deck, a pioneer in thought driven by a hunger to know that never quite switches off. You were the child who asked why ten thousand times, and the work of a lifetime is grounding all that brilliance in real human connection.',
    kws:['Knowledge','Curiosity','Independence','Pioneering'],
    personality:'Curiosity here meets a deep desire for love, and the result is the brightest, most restlessly inquisitive mind in the deck, a pioneer in thought driven by an insatiable need to know, understand, and explore. You were almost certainly the child who asked \'why?\' ten million times, and that hunger never really stops, which is part of why you stay young your whole life. Multi-talented and quick-witted, you are at your best building something genuinely new, and you long, at heart, to leave the world a better place. The shadow is the Ace\'s characteristic self-focus; intellectual drive this strong needs grounding in real human connection to truly flourish. Note: the Ace of Clubs is a semi-fixed card and Spiritual Twin to the 2 of Hearts.',
    strengths:['Brilliant, wide-ranging mind with genuine pioneering instincts','Natural ability to inspire confidence and curiosity in others','Multi-talented across many creative and intellectual fields','Driven by authentic desire to understand and improve the world around them'],
    challenges:['Tendency to neglect practical or financial details in pursuit of ideas','Independence that can shade into self-absorption','Scattering energy across too many interests without completion'] },
  { rank:'2',  suit:'clubs',    sym:'♣', name:'Two of Clubs',     dates:'Dec 16',
    teaser:'A natural diplomat living in the space between minds, happiest one to one and quietly brilliant at building bridges between people who disagree. Seeing every side so clearly has a cost, the indecision and avoidance that can quietly stand in for an honest hard truth.',
    kws:['Communication','Partnership','Diplomacy','Duality'],
    personality:'Cooperation and communication define this card, which lives in the space between ideas and people, a natural diplomat and connector of minds. Gifted, clever and quick-witted, you enjoy good conversation and relate best one-to-one, and you nearly always prefer partnership, personally and professionally. A finely tuned, creative mind gives birth to marvellous ideas you love to share, and you can be genuinely charming with a quick sense of humour. You also enjoy a little mental sparring, which is simply gymnastics for a mind like yours. The shadow is the Clubs tendency toward restlessness: too many perspectives without resolution, or diplomacy that quietly avoids the hard truths. You need real privacy too, without which stress can tip into mental and emotional chaos.',
    strengths:['Natural communicator and skilled diplomatic thinker','Able to hold and synthesise multiple perspectives at once','Warm, cooperative, and intellectually generous','Gifted at building bridges between opposing minds'],
    challenges:['Indecision from seeing every side with equal clarity','Avoiding necessary confrontation in the name of harmony','Mental restlessness when not anchored to a clear purpose'] },
  { rank:'3',  suit:'clubs',    sym:'♣', name:'Three of Clubs',   dates:'Dec 15',
    teaser:'The Writer\'s Card, a prolific mind that turns feeling into words and ideas faster than it can ever finish them. All that indecision you feel is really creative energy looking for somewhere to land.',
    kws:['Creativity','Expression','Ideas','Versatility'],
    personality:'Known as the Writer\'s Card, this is a prolific and restless mind with an extraordinary ability to generate ideas and bring them to life through words, art, or communication. You are most alive when creating, blessed with many natural talents and a rare gift for finding value and meaning in unexpected places, and your giving nature makes you a treasured partner and friend. The challenge is the sheer abundance of that creative output: scattered projects and inspired beginnings without satisfying endings can become a pattern. The indecision you feel is really creative energy looking for somewhere to land, so the work is to learn to govern your own mind and pour it into the things you genuinely love.',
    strengths:['Prolific creative thinker with a gift for expression','Natural ability to find and create value in new ways','Versatile and effective across many fields','Warm, engaging, and genuinely inspiring to others'],
    challenges:['Creative energy scattered across too many unfinished projects','Mental worry and chronic indecision','Risk of generating value for others while neglecting their own direction'] },
  { rank:'4',  suit:'clubs',    sym:'♣', name:'Four of Clubs',    dates:'Dec 14',
    teaser:'Mental structure made into a gift, the natural teacher whose counsel others trust because it has been earned. Two things test you: certainty that hardens into stubbornness, and a streak of self-doubt that can quietly become your worst enemy.',
    kws:['Knowledge','Stability','Teaching','Reliability'],
    personality:'Mental structure is this card\'s gift, one of the most stable and secure energies in the deck: a natural teacher, thinker, and builder of reliable knowledge, known for sound judgment, sharp intuition, and progressive thinking. You are detailed, hard-working, and blessed with real endurance, with a special love of language that draws many to writing, communication, or even acting. Social by nature, you gather interesting people around you and prize developed intelligence and education. Others trust your counsel because it is earned. The challenge is twofold: a tendency toward intellectual rigidity, where certainty hardens into stubbornness, and a streak of self-doubt that can become your worst enemy. Believing in yourself is what secures your considerable success.',
    strengths:['Deeply reliable and practically intelligent','Natural teacher with well-organised, grounded knowledge','Persevering and methodical in all intellectual pursuits','Instinctive sense of the right course of action'],
    challenges:['Intellectual rigidity and resistance to perspectives outside their own','Overcritical of those who think differently','Can become fixed in established ways of knowing long past their usefulness'] },
  { rank:'5',  suit:'clubs',    sym:'♣', name:'Five of Clubs',    dates:'Dec 13',
    teaser:'The Adventurer, a born explorer of ideas and places who is never quite satisfied with what is already known. The catch is depth, because a mind always moving on to the next thing rarely tastes the reward of staying.',
    kws:['Curiosity','Change','Adventure','Restlessness'],
    personality:'The Adventurer is a born explorer of ideas, places, and perspectives, one of the most mentally restless cards in the deck, and for you variety truly is the spice of life. Warm, friendly and playful, you are never quite satisfied with what you already know, which keeps you forever seeking new learning and fresh experiences. Your laser-quick mind generates ideas at speed, and good fortune has a way of finding its way to your door. The shadow is the difficulty of going deep: a mind always moving on to the next thing rarely tastes the rewards of patient, sustained inquiry. Following through on your ideas, and slowing down enough not to act before you have thought, is the secret to your success.',
    strengths:['Insatiably curious and highly adaptable thinker','Thrives on intellectual variety and new horizons','Quick-witted, engaging, and energising communicator','Natural adventurer across both ideas and the physical world'],
    challenges:['Difficulty sustaining focus or long-term commitment','Restlessness that undermines consistency in work and relationships','Can mistake constant motion and novelty for genuine progress'] },
  { rank:'6',  suit:'clubs',    sym:'♣', name:'Six of Clubs',     dates:'Dec 12',
    teaser:'The Messenger, carrying a karmic responsibility in how truth is spoken and a powerful instinct for honest words. Many born here quietly fear their own gifts, and the worry and restlessness that follow are simply the price of that avoidance.',
    kws:['Intuition','Responsibility','Communication','Karma'],
    personality:'Known as the Messenger, this card carries intuitive intelligence and a karmic responsibility in speech and communication, gifted with a powerful attunement to truth and a duty to use language with honesty and care. There are real artistic talents here too, and once you find a belief system that rings true for you, you become genuinely unstoppable, for this is one of the most fortunate cards in the deck and dreaming big can bring you spiritual and material success at once. The shadow lies in avoidance: many born to this card fear their own psychic gifts, and worry, procrastination and restlessness are the price of that evasion. Action, and a disciplined practice of some kind, is the key that unlocks it all.',
    strengths:['Powerful and often psychic intuition','Deeply attuned to truth in speech and communication','Principled, reliable, and innately trustworthy','Strong natural sense of justice and responsibility'],
    challenges:['Fear of or resistance to their own psychic abilities','Chronic restlessness when avoiding their core mission','Karmic patterns connected to the misuse of power or words'] },
  { rank:'7',  suit:'clubs',    sym:'♣', name:'Seven of Clubs',   dates:'Dec 11',
    teaser:'One of the most intellectually gifted minds in the deck, sharpest where cool analysis meets genuine intuition. The same discernment can curdle into chronic worry and a demand for proof that blocks the very knowing that is your gift.',
    kws:['Analysis','Intuition','Spiritual inquiry','Perfectionism'],
    personality:'Mental refinement is the keynote of this eclectic, spontaneous, and spiritually complex card, one of the most intellectually gifted in the deck and deeply aware of what the world needs to become better. Charming, sociable and kind, you are at your most powerful when you combine sharp analytical thinking with genuine intuition, and your enthusiasm for sharing what you know has a way of inspiring others into action; you network, organise, and create on a large scale. The challenge is the 7\'s characteristic tension: a mind this discerning can tip into chronic worry, scepticism, or a demand for logical proof that blocks the very intuition that is your greatest gift. Trading fear for trust, faith and integrity is the work.',
    strengths:['Brilliant analytical mind with genuine creative originality','Highly intuitive and spiritually perceptive','Keenly aware of both human nature and broader social need','Natural ability to take ideas and bring them into the world'],
    challenges:['Chronic mental worry and inner tension','Demand for logical proof that blocks intuitive knowing','Tendency toward agnosticism or scepticism as a form of self-protection'] },
  { rank:'8',  suit:'clubs',    sym:'♣', name:'Eight of Clubs',   dates:'Dec 10',
    teaser:'Mental power and material mastery converging in one of the most fortunate cards in the deck, able to aim the mind at a goal and simply arrive. Undirected, that same force turns domineering and closed; its richest rewards come when it stays open and works alongside others.',
    kws:['Mental power','Success','Focus','Psychic strength'],
    personality:'Mental power and material mastery converge here in one of the most naturally gifted and fortunate cards in the deck, born into success and carrying a rare blend of mental clarity, psychological strength, and psychic sensitivity. You have an extraordinary ability to focus your mind with intention and move powerfully toward whatever you set out to achieve. Being highly sensitive to your environment, you need beauty and harmony around you to stay well. The shadow is the sheer intensity of that power: undirected, the same force that builds success can turn domineering or rigidly closed to outside views. The richest rewards come when you stay receptive and harness that will in partnership with others of like mind. Note: the 8 of Clubs is a fixed card in the Life Spread and a member of the Mystical Family of Seven.',
    strengths:['Extraordinary mental focus and clarity of intention','Naturally gifted at manifestation and achieving success','Psychic sensitivity combined with psychological depth','Highly capable and effective in virtually any field chosen'],
    challenges:['Rigidity in mental structures and deeply fixed ideas','Stubbornness in relationships when challenged intellectually','The intensity of this mind can be overwhelming to others'] },
  { rank:'9',  suit:'clubs',    sym:'♣', name:'Nine of Clubs',    dates:'Dec 9',
    teaser:'Universal wisdom and the close of the mental cycle, where every ending quietly opens onto something new. The great work is learning when to let go, of old beliefs, familiar patterns, and the need to always have the answer.',
    kws:['Completion','Wisdom','Letting go','Universal mind'],
    personality:'Universal wisdom and the completion of the mental cycle define this card, where every ending opens onto new beginnings and fresh possibility. Your life will always be filled with revelations and new learning, for you are a great thinker walking a path of creative mental development, carrying a vast intellectual range and a genuine calling to serve others through the sharing of knowledge. You are fond of pleasure too, sensuous and romantic by nature, and must guard against over-indulgence and the disappointment that unconscious action brings. The great work is learning when to let go, of outdated beliefs, familiar mental patterns, and the need to always have the answer, opening yourself instead to entirely new ways of seeing.',
    strengths:['Broad intellectual range and genuine, hard-won wisdom','Naturally drawn to education and the service of knowledge','Generous and inspiring in sharing insight and experience','Philosophical mind that grasps the largest possible picture'],
    challenges:['Difficulty releasing mental patterns that have run their course','Chaos or instability when out of alignment with their path','Tendency to connect with people or ideas that no longer serve growth'] },
  { rank:'10', suit:'clubs',    sym:'♣', name:'Ten of Clubs',     dates:'Dec 8',
    teaser:'The first of the Crown line and one of the most powerful minds in the deck, able to work circles around almost anyone. The danger is that when talent comes this easily it can be coasted on, and the full measure of what you could do goes unmet.',
    kws:['Achievement','Leadership','Discipline','Mental power'],
    personality:'The first card in the Crown line and one of the most intellectually powerful in the deck, this is the healer and teacher, blessed with a powerful, driving mind and fierce independence. You can accomplish almost anything you set out to do, contributing dependably to family and community and capable of working circles around everyone around you. So active a mind can make it genuinely hard to relax, and practices like meditation or yoga repay you richly. Relationships are a place of learning, since your strong will likes to be in control and career can feel more satisfying than partnership. The shadow is that without real self-discipline, abundant talent can be coasted upon, and the full measure of what you could achieve goes unmet.',
    strengths:['Exceptional intellectual potential and breadth of capability','Natural leader and authority in their chosen field','Generous and inspiring in sharing knowledge','Capable of achieving genuine world-class mastery'],
    challenges:['Self-discipline challenges that arise from things coming too easily','Can exceed traditional structures in ways that create isolation','Must learn to work within the limits of emotional connection, not above it'] },
  { rank:'J',  suit:'clubs',    sym:'♣', name:'Jack of Clubs',    dates:'Dec 7',
    teaser:'A mental genius and the deck\'s perpetual student, here to drag the future into the present and improve almost any system it touches. The brilliance is real, but without honesty and commitment it stays a stack of bright beginnings that never quite land.',
    kws:['Wit','Curiosity','Creative mind','Authentic self'],
    personality:'A mental genius and the perpetual student of the deck, quick-witted, creative, and intellectually playful, with an innovative, progressive mind and a natural entrepreneurial spirit. You are here to bring the future into the present, gifted at seeing how to improve the quality of life and the workings of almost any system, and able to dive deeply into whatever captures you, analyse it thoroughly, and present it with real clarity. You love to debate, and your mind runs so much faster than everyone else\'s that patience becomes a genuine discipline. The shadow is the Jack\'s avoidance of full maturity: the brilliance is real, but without honesty and commitment it becomes bright beginnings that never quite land. Living with authenticity is what lets the gifts take root.',
    strengths:['Quick-witted, creative, and mentally engaging','Authentically individual and difficult to put in a box','Emotionally and psychologically more resilient than they appear','Natural ability to connect ideas and people in fresh ways'],
    challenges:['Avoiding the responsibility that comes with genuine intellectual gifts','Tendency to deflect with humour or cleverness when depth is called for','Choosing depth over novelty remains the ongoing work'] },
  { rank:'Q',  suit:'clubs',    sym:'♣', name:'Queen of Clubs',   dates:'Dec 6',
    teaser:'The administrator of knowledge, pairing genuine intellectual mastery with a rare spiritual sensitivity, gifted less at knowing than at passing what she knows to others. Stretched too thin, that strong will can tip into stress and drama, so a solid inner base is what keeps her balanced.',
    kws:['Intuition','Knowledge','Wisdom','Balance'],
    personality:'The administrator of knowledge, this is one of the most intuitively intelligent cards in the whole deck, combining genuine intellectual mastery with rare spiritual sensitivity. Masterful at whatever you choose, you are destined for success through a brilliant mind, generous intuitive gifts, and a gracious personality, and your real talent is not merely knowing but transmitting: inspiring, counselling, and guiding others toward truth with warmth and precision. You carry tremendous pride and a need to let the world see what you are capable of. The challenges are real: a tendency to over-extend into stress, and a strong will that, when uncertain or stretched too thin, can turn dramatic or neurotic. A solid spiritual base and honest self-expression are what keep you balanced. Remember, you are the Queen.',
    strengths:['Exceptional intuitive intelligence and mental clarity','Natural counsellor, teacher, and guide','Balances intellectual rigour with genuine spiritual openness','Nurturing and generous in the sharing of knowledge and insight'],
    challenges:['Can carry the mental and emotional weight of others as her own','Sacrifice patterns that need to be managed consciously','Difficulty maintaining clear boundaries around energy and time'] },
  { rank:'K',  suit:'clubs',    sym:'♣', name:'King of Clubs',    dates:'Dec 5',
    teaser:'This King rules by what he knows, a specialist and authority who rarely bends to anyone else\'s doctrine. The crown he wears is authenticity, and keeping it asks for constant self-transformation, the willingness to question and rebuild himself again and again.',
    kws:['Mental mastery','Authority','Wisdom','Self-transformation'],
    personality:'This King rules the mental realm of intelligence, knowledge, and intuition, holding power through what he knows: a specialist, a thinker, and an authority in whatever field he chooses to master. Blessed with a great mind and an innate wisdom, you communicate what you know with ease and can become an authority in business, the arts, science, or politics. You are the master of your own thinking, rarely bound by the doctrines of others, and you wear what might be called the crown of authenticity, carrying a commanding presence, natural grace, and a good sense of humour. The inner work of this card is constant self-transformation: real authority is earned not only through knowledge but through the ongoing willingness to question, shed, and rebuild yourself.',
    strengths:['Mastery-level intellectual authority in their chosen field','Natural leader and specialist who earns deep, lasting respect','Driven by ideas, knowledge, and the ongoing pursuit of growth','Excellent at building powerful and purposeful professional networks'],
    challenges:['Argumentativeness or mental rigidity when their authority is challenged','Spiritually minded but can be practically demanding and exacting','True growth requires releasing as much as acquiring, a hard lesson for a King'] },

  // DIAMONDS
  { rank:'A',  suit:'diamonds', sym:'♦', name:'Ace of Diamonds',  dates:'',
    teaser:'Imagination put straight into action, a visionary and natural pioneer in the making of value. The lifelong tension sits between the drive to achieve and the longing for real love, because fierce independence can quietly crowd out the very intimacy you want.',
    kws:['Ambition','Independence','Value','Pioneering'],
    personality:'Imagination in action drives this card, a true visionary and natural pioneer in commerce, enterprise, and the creation of value. Brilliant, charming, and endlessly resourceful, you have amazing perceptual skills, an extraordinary capacity to influence others, and a goodhearted love of play; travel and change of any kind suit the restless side of your nature. You are ambitious, independent and energetic, motivated by both money and love, and quietly driven by a wish to improve the quality of life for others. The great tension of this card lies between professional ambition and the longing for genuine love: the relentless pursuit of achievement can quietly eclipse the hunger for connection, and your fierce independence can complicate intimacy until the two are brought into honest reckoning.',
    strengths:['Brilliant, resourceful, and naturally entrepreneurial','Powerful charm and rare ability to inspire confidence in others','Quick mind with an innate instinct for where value lies','Pioneer energy that drives genuine originality and innovation'],
    challenges:['Independence that can shade into isolation or avoidance of real intimacy','Love and personal life can suffer in the relentless pursuit of achievement','Fear of negotiation or compromise must be overcome to fully thrive'] },
  { rank:'2',  suit:'diamonds', sym:'♦', name:'Two of Diamonds',  dates:'',
    teaser:'Where logic meets intuition, a natural negotiator who builds arrangements that genuinely work for everyone involved. The shadow is bringing that same transactional eye home, into relationships where worth was never meant to be measured.',
    kws:['Partnership','Values','Balance','Negotiation'],
    personality:'Where logic meets intuition, this card lives at the intersection of relationship and value: a natural negotiator, collaborator, and builder of mutually beneficial arrangements. Blessed with sound logic and excellent intuition, you find that following your instincts reliably leads to success while ignoring them does the opposite. You are spurred into action by a sense of mission, have real organisational gifts, and delight in the wheeling and dealing that makes this one of the most successful cards in the deck; you are happiest when productive and seem to know instinctively how to make money. The shadow is a tendency to bring that same transactional lens to personal relationships, where worth is not always something that can, or should, be measured.',
    strengths:['Natural negotiator and skilled architect of strong partnerships','Deeply attuned to the value of people, agreements, and situations','Cooperative and strategically thoughtful','Exceptional ability to find common ground and create mutual benefit'],
    challenges:['Unconsciously measuring relationships in terms of return or fairness','Indecision when two paths appear equally valuable','Fear of being undervalued or taken advantage of in agreements'] },
  { rank:'3',  suit:'diamonds', sym:'♦', name:'Three of Diamonds', dates:'',
    teaser:'A colourful, inventive mind that finds worth in the places other people overlook and refuses to be like everyone else. The familiar pull between freedom and security can spin into worry-driven circles until that restless creativity finally gets a channel.',
    kws:['Creativity','Versatility','Expression','Uncertainty'],
    personality:'A colourful character with a bright, inventive mind, artistic and romantic by nature and forever drawn to the unusual, you have a real flair for creative value-making, finding worth and meaning in places others overlook. Your agile mind needs to be challenged and entertained, and you will always look for innovative ways to express who you truly are; you are not here to be like everyone else. The challenge, common to all Threes, is the pull between freedom and security, and a worry-driven indecision that can have you going in circles. Left unapplied, that restless creativity curdles into confusion. The discipline of sustained commitment is what grounds you, and love, where your greatest learning happens, is where it matters most.',
    strengths:['Bright, inventive, and creatively original mind','Natural talent for finding, making, and promoting value','Versatile and effective across many fields and ventures','Expressive, socially engaging, and genuinely inspiring'],
    challenges:['Uncertainty and restlessness as a recurring life pattern','Difficulty committing to one path or project long enough to master it','Can move between ventures, jobs, or relationships before depth is fully reached'] },
  { rank:'4',  suit:'diamonds', sym:'♦', name:'Four of Diamonds', dates:'',
    teaser:'One of the most financially grounded cards in the deck, a steady builder of lasting value and the dependable backbone of any enterprise. The paradox is the restlessness hidden inside all that stability, and the rigidity that can quietly close you off from the growth only change brings.',
    kws:['Security','Stability','Material foundation','Discipline'],
    personality:'Stability in values is this card\'s whole nature, one of the most financially grounded and materially secure in the deck, a natural builder of lasting value and practical abundance. You carry a responsibility to integrity and find genuine contentment in being diligent with what you value; you are happiest when working, naturally suited to business, and well cast as the dependable backbone of any enterprise. The paradox is that for all your love of stability, there is an innate restlessness in you that can surface as insecurity, uncertainty, or self-doubt about your choices. The deeper challenge is the rigidity that often accompanies such groundedness: the security you build so carefully can harden into stubbornness, closing you off from the growth that only change can bring.',
    strengths:['Exceptional capacity for building lasting financial security','Detailed, organised, and practically gifted in material matters','Deeply reliable in commitments, agreements, and partnerships','Intellectually motivated with a continuously evolving career'],
    challenges:['Rigidity or stubbornness in financial and material thinking','Can become so focused on security that joy and flexibility are squeezed out','Physical and psychological self-development requires sustained, deliberate effort'] },
  { rank:'5',  suit:'diamonds', sym:'♦', name:'Five of Diamonds', dates:'',
    teaser:'A seeker of truth and one of the most adaptable cards in the deck, turning setbacks into stepping stones through sheer trial and error. The risk is spending all that energy forever moving on, rather than building something that lasts.',
    kws:['Change','Resourcefulness','Values','Freedom'],
    personality:'A seeker of truth, one of the most resourceful and adaptable cards in the deck, forever looking for the deeper value and worth of whatever stands before you. Adventurous and gifted with good intuition, you love change and the freedom to explore, and you have a rare ability to make progress through trial and error, turning setbacks into stepping stones. You are a natural salesperson who can sell anything you truly believe in, highly relatable, and trusted by others because you share your wisdom with compassion rather than expectation. The shadow is an instability in values and resources, and a restlessness in both work and love; without deliberate grounding, you can spend your energy perpetually moving on rather than building something that endures.',
    strengths:['Highly resourceful and skilled at improving difficult situations','Adapts quickly and thrives when problem-solving is required','Practically useful, energetic, and committed in their work','Natural ability to reach and communicate with many different people'],
    challenges:['Instability in finances or material resources as a recurring life pattern','Difficulty settling on one path of value long enough to reach mastery','Must consciously shed unhealthy patterns rather than simply moving on from them'] },
  { rank:'6',  suit:'diamonds', sym:'♦', name:'Six of Diamonds',  dates:'',
    teaser:'A card of karmic return, where abundance arrives in exact proportion to what you put in and nothing here is ever passive. The lesson hiding inside the effort is a quiet one: knowing when enough is truly enough.',
    kws:['Karma','Intuition','Fulfilment','Sustained effort'],
    personality:'Responsibility to values is the heart of this card, which operates squarely within the law of karmic return: abundance flows in direct proportion to the energy invested, and you receive exactly what you earn. Blessed with great intelligence, sound intuition, and a remarkable psychic attunement, you are genuinely gifted at counselling others and at finding fulfilment in what life provides. You have a strong physical constitution, too, shared by many world-class athletes, and a natural sense of financial responsibility that dislikes carrying debt. Strong-willed as you are, flexibility and harmonious surroundings keep you healthy and happy. The challenge is the ongoing effort this card requires: success here is never passive, and the karmic lesson is knowing when enough is truly enough.',
    strengths:['Powerful intuition, often bordering on the psychic','Exceptional counselling wisdom and practical insight','Deeply attuned to the art of finding fulfilment in the present','Steady, sustained success built through genuine dedicated effort'],
    challenges:['Success demands constant energy and cannot be taken for granted','Reaching for more than this card\'s natural harvest leads to discontentment','Karmic lessons around knowing when enough is truly enough'] },
  { rank:'7',  suit:'diamonds', sym:'♦', name:'Seven of Diamonds', dates:'',
    teaser:'The millionaire\'s card, the meeting of spirit and matter, where money becomes the very place you learn faith and trust. It asks for a narrow, single-pointed focus and the willingness to release the values and relationships that have outlived their use.',
    kws:['Discernment','Self-development','Focus','Transformation'],
    personality:'Known as the millionaire\'s card, the 7 of Diamonds represents the union of spirit and matter, and the work of a lifetime is bringing those two into balance. Highly creative, nurturing and caring, you hold your loved ones dear and will sacrifice for them, though guarding against self-sacrifice, and letting yourself receive, is part of the path. Money is a major theme here, the very place you learn faith and trust, for when you manifest your creativity in practical ways your worries become your successes. The shadow is the discipline this asks: you must hold your focus on one thing with absolute clarity and be willing to release outdated values, skills, and relationships to clear the way. Note: the 7 of Diamonds is a semi-fixed card and Spiritual Twin to the 9 of Hearts.',
    strengths:['Extraordinary potential for material and financial achievement','Deeply self-directed and capable of sustained single-pointed focus','Tough, resilient, and forged by the challenges that define them','Highly discerning about what is truly worth their time and energy'],
    challenges:['Must be willing to release anything no longer aligned with their vision','Scattered focus produces very little; the path to success is a narrow one','Constant change in career and business is a feature, not a flaw, of this card'] },
  { rank:'8',  suit:'diamonds', sym:'♦', name:'Eight of Diamonds', dates:'',
    teaser:'The Sun Card, genuine material power and a mind that draws money in with surprising ease, best of all when it answers to no boss but itself. Beneath the steel runs real care for others, shadowed by a mistrust of intimacy that quietly argues with the heart\'s own longing.',
    kws:['Power','Material mastery','Organisation','Responsibility'],
    personality:'Sometimes called the Sun Card or the card of luck, this is genuine material power: a deep capacity to manage, organise, and govern in the realm of value and resources, paired with a brilliant mind that draws money your way with surprising ease. You focus intention toward your goals like few others, carry real personal strength and creative intelligence, and tend to be respected wherever you work, doing best as your own boss. Beneath the steely exterior runs an inner drive toward fairness and care for others. Two shadows ask for attention: a tendency to turn domineering or stubborn and hold your expectations of people too high, and a quiet mistrust of intimacy that sits at odds with the heart\'s genuine longing to love and be loved.',
    strengths:['Exceptional organisational ability and material mastery','Strong sense of fairness, trustworthiness, and practical responsibility','Deep inner drive to protect and empower others','High capacity to manifest and build lasting material success'],
    challenges:['Deep mistrust of intimate relationships as a lifelong undercurrent','Can become domineering when the power instinct is not consciously tempered','Must develop self-worth that is genuinely independent of financial standing'] },
  { rank:'9',  suit:'diamonds', sym:'♦', name:'Nine of Diamonds', dates:'',
    teaser:'The one who gives, among the most generous cards in the deck, called to champion the underdog and bring people together around their gifts. Its whole lesson is release, because money flows most freely through you when it is something to pass on rather than to hold.',
    kws:['Completion','Generosity','Philanthropy','Release'],
    personality:'The one who gives, this is among the most generous and philanthropic cards in the deck, a soul with a real calling to serve the less fortunate and champion the underdog. You are gifted with excellent communication and a gregarious open-heartedness; people naturally trust you, and you excel at bringing others together to share their gifts. Highly intelligent and global in your thinking, you thrive on mental stimulation and the company of witty, intelligent people, and your discernment tells you unerringly what is truly worthwhile. The life lesson is the release of attachment to material wealth: money and resources flow most freely through you when seen as something to pass through and on, rather than to hold and accumulate.',
    strengths:['Genuinely generous, open-hearted, and naturally philanthropic','Powerful manifesting ability when backed by real self-worth','Deep intuitive and psychic attunement to truth in situations','Natural orator with an engaging, warm, and often humorous presence'],
    challenges:['Resentment when power or recognition feels withheld or unearned','Spendthrift tendencies when the card\'s shadow side is expressed','Must release attachment to material outcomes in order to fully receive them'] },
  { rank:'10', suit:'diamonds', sym:'♦', name:'Ten of Diamonds',  dates:'',
    teaser:'A card of fortunate blessings that holds the entire Diamond suit, optimistic and sure of its own worth even down to the last dollar. The secret is almost too simple: work hard for what you want, and be grateful for what you already have.',
    kws:['Abundance','Self-worth','Optimism','Responsibility'],
    personality:'A card of fortunate blessings, the 10 of Diamonds encompasses the entire Diamond suit, material success, sustained activity, and the full spectrum of value in its most complete expression. You carry a naturally optimistic outlook and a strong innate sense of your own worth, and even down to your last dollar, something always spurs you to manifest income afresh. People trust you, which makes working with the public rewarding, and when you focus your considerable powers, you can make almost anything happen. The secret is simply this: work hard for what you want, and be grateful for what you have. The shadow is the weight that comes with such material engagement, for real success here demands constant, grounded stewardship rather than optimism alone.',
    strengths:['Naturally optimistic with a strongly developed sense of self-worth','Broad capacity for achievement spanning the full range of material values','Understands deeply that real abundance has a price, and pays it willingly','Steady and sustained in engaging with financial responsibilities'],
    challenges:['Overoptimism or unrealistic self-assessment can create expensive blind spots','The weight of constant responsibility must be actively and consciously managed','Developing emotional connections alongside material ones is ongoing work'] },
  { rank:'J',  suit:'diamonds', sym:'♦', name:'Jack of Diamonds', dates:'',
    teaser:'The golden child of the suit, quick-witted and charming, with sharp financial instincts and a gift for persuasion that can manifest things at startling speed. The shadow is immaturity, the clever charm that turns unreliable, so the real work is pouring all that brilliance into genuine integrity.',
    kws:['Persuasion','Resourcefulness','Independence','Youthful values'],
    personality:'Creative independence is the signature of this card, the golden child of the suit: quick-witted, charming, highly intuitive, and blessed with sharp financial instincts and a natural gift for persuasion. Freedom is your middle name, and you bring an exuberant energy to everything you touch, often making things manifest at impressive speed; your intuitive, perceptive nature also makes you a natural therapist, counsellor, or healer. You can be social and fond of the limelight one moment and quiet, refined, and craving your own world the next. The shadow is a tendency toward immaturity: at its lowest, this card turns clever but unreliable, even cunning, breaking commitments to those who believed in it. The great work is channelling real brilliance into genuine integrity and depth of character.',
    strengths:['Sharp financial instincts and a natural, disarming gift for persuasion','Exuberant, magnetic, and genuinely enjoyable to be around','Thrives on independence, self-direction, and entrepreneurial enterprise','Fast-moving mind with a real visionary streak and strong intuition'],
    challenges:['Immaturity, unreliability, or the breaking of promises','Can become absorbed in their own story to the point of self-deception','Life will periodically place deep challenges in the path to force true self-awareness'] },
  { rank:'Q',  suit:'diamonds', sym:'♦', name:'Queen of Diamonds', dates:'',
    teaser:'The cultivator of high value, determined and cultured, who knows exactly what she wants and earns it through sheer consistency. The path is genuinely hard, and her own high standards can turn critical and demanding if she lets them run unchecked.',
    kws:['Refinement','Excellence','Determination','Material mastery'],
    personality:'The cultivator of high value, gifted with a highly developed intelligence, keen perceptual skills, and tremendous endurance, you embody the wisdom of higher values and quietly exemplify them for others. Cultured and determined, you know exactly what you want and approach your goals with a consistency, diligence, and perseverance that commands real respect, which is why you so often find yourself in positions of authority and leadership. Loving, generous, courageous and inventive, you also read people with ease. The path is not an easy one, beset with genuine difficulty and demanding resilience alongside ambition, and your high standards can tip into being overly critical, judgmental, or demanding if left unchecked. The reward is a life of real excellence, built entirely by your own hand.',
    strengths:['Exceptional ability to identify, develop, and elevate genuine value','Determined, diligent, and strong of character under real pressure','Refined focus capable of producing world-class, lasting results','Earns deep and lasting respect through consistent effort and excellence'],
    challenges:['The path is genuinely demanding and rarely without serious obstacles','Risk of hardness or dominance when under prolonged pressure','Unrealistically high standards, when unchecked, breed chronic dissatisfaction'] },
  { rank:'K',  suit:'diamonds', sym:'♦', name:'King of Diamonds', dates:'',
    teaser:'Master of higher values, ruling money and manifestation through a rare blend of decisive action and real care for people over numbers. The old portrait shows him in profile with one eye hidden, a quiet warning about the one-sided thinking he has to work against.',
    kws:['Financial mastery','Leadership','Self-awareness','Wisdom'],
    personality:'Master of higher values, this King holds dominion over the realms of money and manifestation, ruling through a rare combination of decisive action and love. A visionary leader in business and commerce, you carry an innate wisdom for making things work and, with a disciplined mind and genuine values, an understanding of the very laws of abundance and integrity, all of it tempered by a warmth and fairness that places people before numbers. Sociable and ambitious from early life, you are drawn to leadership, self-improvement, and the company of exceptional minds. The classic portrait shows this King in profile, a single eye visible, a hint of the stubbornness and one-sided thinking you must consciously work against on the road to lasting authority.',
    strengths:['Phenomenally gifted in business, value creation, and material leadership','Leads with genuine fairness and a deep care for the people around them','Passionate about self-improvement and relentlessly committed to growth','Sociable, magnanimous, and genuinely inspiring in their presence'],
    challenges:['Psychological and health challenges that periodically force necessary inner work','Can feel profoundly stuck until the inward journey is honestly undertaken','Must eventually learn that material wealth, for all its beauty, cannot purchase true fulfilment'] },

  // SPADES
  { rank:'A',  suit:'spades',   sym:'♠', name:'Ace of Spades',    dates:'',
    teaser:'The Key to the Mystery of Life, pictured as the Magician and the most spiritually charged card in the whole deck, a soul that reinvents itself through hardship and comes back stronger each time. The lifelong tug is between the hunger for wisdom and the drive to succeed, and the secret is making room for the love the whole journey is actually for.',
    kws:['Transformation','Spirituality','Wisdom','Independence'],
    personality:'Called the Key to the Mystery of Life, and pictured as the Magician, the Ace of Spades is the most spiritually charged card in the entire deck: a soul called to profound personal transformation, reinventing itself through adversity and emerging stronger each time. You carry a magnetic, almost psychic quality that draws others to you for guidance they cannot fully explain, and an incredible intelligence that could see you move through several distinct careers in one lifetime. At your core runs a tug of war between the desire for wisdom and the drive to succeed in worldly ways; the secret is a balance that honours both. The great work is learning that your fierce drive for self-definition must make room for love, which is, ultimately, what the journey is for.',
    strengths:['Deeply spiritual, psychic, and magnetically compelling to others','Extraordinary capacity for self-transformation and personal renewal','Courageous ability to look unflinchingly into the self','Remarkable precision in reading people and situations'],
    challenges:['Intense independence and drive for self-definition can come at the cost of loved ones','Must learn to balance ambition with genuine emotional availability','The path requires repeated, sometimes painful, shedding of identity'] },
  { rank:'2',  suit:'spades',   sym:'♠', name:'Two of Spades',    dates:'',
    teaser:'The friendship card, a soul building real self-sufficiency through honest connection and the discovery of its own strength. The truth it keeps proving, over and over, is that the finest resource you will ever meet is the one already inside you.',
    kws:['Partnership','Self-reliance','Inner strength','Health'],
    personality:'Known as the Aquarian card and the friendship card of the deck, the 2 of Spades is a soul developing powerful self-sufficiency through authentic connection and the discovery of individual strength. You carry companionship, support and compassion in your nature, prefer to work and live in partnership, and find that giving guidance comes effortlessly; on a spiritual path you readily become a teacher or leader and gain recognition for it. Your considerable determination, passion and strength can even be intimidating to others, which would surprise you. When out of sorts, that energy can collapse into fear, passivity, or shyness. The great truth of this card is that the finest resource you will ever meet is the one already within you, and life keeps arranging itself to prove it.',
    strengths:['Powerful capacity to develop genuine inner strength and self-sufficiency','Natural ability to attract the right partnerships and healing at the right time','Authentic, individualistic, and solid in their unique way of being','Real grit and resilience through life\'s most demanding passages'],
    challenges:['Can find themselves in difficult situations before recognising their own power to handle them','Partnership energy must be balanced with genuine personal independence','Learning not to outsource inner knowing to the opinions of others'] },
  { rank:'3',  suit:'spades',   sym:'♠', name:'Three of Spades',  dates:'',
    teaser:'The Artist card, a powerhouse of creative energy and warmth with an unexpected head for business underneath. The familiar shadow is indecision around work, the gift left unused in the safety of the status quo, until you finally believe in yourself.',
    kws:['Creativity','Expression','Indecision','Work'],
    personality:'Known as the Artist card, the 3 of Spades is a powerhouse of creative energy, magnetic personality, and a genuine desire to help others, paired, less obviously, with a sharp mind for business. You carry real talent and a warm, expressive spirit that people are drawn to, and when you apply the mastery of this card in practical ways, with effort and integrity, success is all but guaranteed. The shadow is the 3\'s characteristic indecision around work and career: the very abilities that qualify you for your highest expression can be quietly left unused in the safety of the status quo. Believing in yourself is the key that unlocks the door, and fostering real self-love is what finally lets love be realised.',
    strengths:['Powerfully creative with genuine, broad artistic talent','Magnetic personality and instinctive desire to help','Warm, strong social presence that draws people in','Naturally aligned with strong mentors, particularly women in leadership'],
    challenges:['Work-related indecision as a recurring karmic theme','Risk of settling far below what these gifts actually deserve','Worry about reputation, gossip, and the opinions of others'] },
  { rank:'4',  suit:'spades',   sym:'♠', name:'Four of Spades',   dates:'',
    teaser:'The builder of the Spades suit, with a focus and willpower so unmatched you will often choose the harder road on purpose. The work is staying loose enough to play, letting worry and routine give way before they quietly turn into stagnation.',
    kws:['Stability','Discipline','Work ethic','Security'],
    personality:'Personal strength and willpower are the gifts of this quietly powerful card, the builder of the Spades suit, whose ability to focus and move through obstacles is all but unsurpassed, so much so that you will often choose the harder path to get where you are going. Work and productivity matter deeply to you, and you are happiest when busy with something you love; reliable, intelligent, intuitive and personable, you find real satisfaction in honest effort and prefer to be your own boss. A strong constitution tends to bless you with good health, and your endurance and dependability toward those you love know no equal. The challenge is to stay receptive and flexible, letting worry, stubbornness, and routine give way to play and adventure.',
    strengths:['Exceptional work ethic and capacity for sustained, disciplined effort','Deeply reliable and genuinely organised in all that they undertake','Finds real satisfaction and pride in honest, thorough work','Natural builder of security, health, and enduring structure'],
    challenges:['Can become so anchored in routine that necessary change is resisted','Overcritical when others do not meet the same high standards of effort','Must ensure that the stability they build does not quietly become stagnation'] },
  { rank:'5',  suit:'spades',   sym:'♠', name:'Five of Spades',   dates:'',
    teaser:'Change itself, a card whose very presence tends to set it in motion, and one of the most driven self-improvement energies in the deck. The shadow is the intensity of all that restlessness, the constant moving, and learning to balance company with solitude.',
    kws:['Change','Progress','Self-improvement','Restlessness'],
    personality:'Change is the dynamic at the centre of this card, and your very presence tends to act as a catalyst for it. Gifted with a good sense of values and strong intuition, you are usually well-liked, often genuinely popular, with admirers you secretly enjoy even when the attention grows overwhelming. The desire to experience life can run stronger than the desire to accomplish, and that is fine: travel, adventure, and new people all feed fresh self-awareness in you. This is also one of the most driven self-improvement cards in the deck, pushing beyond ordinary limits in great leaps. The shadow is the intensity of that restlessness, frequent changes of place, circumstance, or relationship, and learning to balance company with solitude is part of the path.',
    strengths:['Extraordinary natural capacity for self-transformation at every level','Driven and deeply resourceful in the face of health and life challenges','Makes bold, decisive leaps in personal growth when the time is right','Converts negative energy and old habits into real, lasting strength'],
    challenges:['Restlessness producing frequent moves, career changes, or relationship transitions','The consolidation periods between leaps feel deeply uncomfortable','The intensity of this inner drive can be genuinely difficult for others to keep pace with'] },
  { rank:'6',  suit:'spades',   sym:'♠', name:'Six of Spades',    dates:'',
    teaser:'Often called the conscience of humanity, carrying one of the heaviest karmic legacies in the deck, with many born here sensing their lives are somehow fated. They are, but the power short-circuits into inertia whenever the will goes unsupported; align with something higher and act, and life turns genuinely magical.',
    kws:['Karma','Responsibility','Conscience','Adjustment'],
    personality:'Often called the conscience of humanity, the 6 of Spades carries one of the most powerful karmic legacies in the deck, and many born to it feel their lives are somehow fated or destined. They are. With strong traits of honesty, fairness, responsibility and kindness, you hold real potential to be a force for alignment between the visible world and the higher laws that govern it, and unlimited potential for recognition once you take responsibility for the power you were born with. This is a dreamy card, though, prone to fantasy and escapism, and your greatest enemies are laziness and procrastination. The shadow is inertia: when the heart is confused and the will unsupported, this card\'s power can turn in on itself. Align with higher wisdom and act, and life becomes magical.',
    strengths:['Tremendous willpower, inner determination, and staying power','Deep karmic potential when responsibility is honestly embraced','Vision and conscience for aligning reality with higher principle','Highly creative and capable of extraordinary achievement when inspired'],
    challenges:['Indecision and confusion in matters of love as a persistent karmic challenge','Inertia when responsibilities feel overwhelming or in conflict with personal goals','Power can be short-circuited by superficiality, gossip, or avoidance of depth'] },
  { rank:'7',  suit:'spades',   sym:'♠', name:'Seven of Spades',  dates:'',
    teaser:'The card of the mystic and the artist, an old soul asked to build unshakeable faith through the repeated testing of the material world. Its trap is aiming that inner power at outward magnificence, when the real treasure has always lived within.',
    kws:['Wisdom','Faith','Spiritual testing','Self-mastery'],
    personality:'The card of the mystic and the artist, the 7 of Spades is one of the most spiritually demanding in the deck: an old soul called to develop unshakeable faith through the repeated testing of the material world. Very intuitive and extremely sensitive to those around you, you carry an acute understanding of human nature and a perceptive intelligence that works quietly, often behind the scenes; surrounding yourself with beauty and serenity is essential to your wellbeing. Your natural ingenuity can bring real success in the arts or metaphysics, and you hold within you the power to transform and to see beyond apparent limitations. The shadow is the misdirection of that inner power toward a longing for outward magnificence, when the real treasure, immense as it is, has always lived within.',
    strengths:['Profound accumulated wisdom and perceptive understanding of people','Exceptional memory, psychological acuity, and natural insight','Capable of genuine self-mastery when the inward journey is embraced','Natural psychologist, writer, or world traveller'],
    challenges:['Material discontent when life is lived beyond natural and sustainable means','Health and stress challenges tied to worry and frustrated ambition','Must redirect power inward, from the longing for magnificence to the finding of it'] },
  { rank:'8',  suit:'spades',   sym:'♠', name:'Eight of Spades',  dates:'',
    teaser:'Endurance in a single word, an intense, almost psychic force of will working from somewhere deep inside rather than out front. The whole task is giving that force a grounded direction, because the same will that moves mountains can, misdirected, turn against the self.',
    kws:['Willpower','Inner power','Transformation','Discipline'],
    personality:'Endurance is the one word for this card, one of the most internally powerful in the deck: not the commanding outer authority of the King, but an intense, often psychic force of will working from deep within. Blessed with strong determination and the ability to follow through on anything, you are a natural overcomer of adversity with a genuine gift for healing and for work in health and medicine, and a brilliant, creative mind that can equally find success in business or technology. Success is assured if you are willing to work hard, and being acknowledged for that work spurs you to excel further. The great work is giving this force a positive, spiritually grounded direction, and guarding your health, since the same will that moves mountains can, misdirected, turn against the self.',
    strengths:['Extraordinary inner willpower and depth of concentration','Natural overcomer of obstacles, adversity, and serious health challenges','Genuine capacity to heal and transform others through presence and will','Develops superb leadership ability under real, sustained pressure'],
    challenges:['Tendency toward a negative or fatalistic outlook that must be actively and consciously countered','Can feel profoundly stuck until the inner journey is honestly undertaken','The intensity of this card\'s power is a genuine responsibility, not merely a gift'] },
  { rank:'9',  suit:'spades',   sym:'♠', name:'Nine of Spades',   dates:'',
    teaser:'Spiritual liberation, one of the most magnetic and emotionally intense cards in the deck, of unlimited possibility for those who read their lives the right way. The shadow is the sheer depth of that intensity, and the path to freedom runs directly through it, never around.',
    kws:['Completion','Spiritual liberation','Service','Letting go'],
    personality:'The esoteric meaning of the 9 of Spades is spiritual liberation, making it one of the most magnetically powerful and emotionally intense cards in the entire deck, and one of unlimited possibility for those who read their lives the right way. Born with an inherent spiritual nature that taps higher knowledge, you are intelligent, artistic, original and unconventional in your thinking, frequently musically gifted, and called to a life of universal service in which your magnetism and capacity for leadership can become extraordinary. This is a card of accomplishment or disappointment depending entirely on how you choose to interpret what happens, so an impersonal approach that keeps you balanced and on course is the key. The shadow is the depth of its emotional intensity; the path to liberation moves directly through it, never around.',
    strengths:['Tremendous personal magnetism and natural authority in any room','Genuine, deep calling toward service, leadership, and the healing of others','Capable of managing significant responsibilities and large-scale endeavours','Original, unconventional, and deeply spiritual approach to wisdom'],
    challenges:['Intense inner emotional conflicts and psychosomatic stress as recurring patterns','Flirtatious or restless in love, with difficulty sustaining genuine depth','Must learn to sublimate rather than suppress the emotional intensity that defines them'] },
  { rank:'10', suit:'spades',   sym:'♠', name:'Ten of Spades',    dates:'',
    teaser:'Success is the keyword, a card both deeply materialistic and highly spiritual, with the whole challenge living in the polarity between the two. The great secret runs against everything its drive believes: surrender, let yourself be nurtured, and the freedom hidden inside acceptance opens up.',
    kws:['Effort','Mastery','Self-love','Abundance'],
    personality:'Success is the keyword for the 10 of Spades, a card both strongly materialistic and highly spiritual, and the challenge, and the gift, lies in the polarity between the two. The invitation is to go beyond the material while fully mastering it, attaining spiritual awareness without surrendering worldly success. This is driven energy that accomplishes every goal it commits to, powered by a sophisticated intelligence, and you thrive in the company of like-minded people; isolation, by contrast, can lead to misfortune and even poor health. Ambitious as you are, confusion between love and work is a recurring theme, and too much weight on career can starve your relationships. The great secret is surrender: focus on your feelings, allow yourself to be nurtured, and the freedom hidden inside acceptance opens up.',
    strengths:['Exceptional capacity for sustained, demanding work across every dimension of the self','Encompasses the full breadth of Spades wisdom within one lifetime','Developing profound self-love and the ability to feel at home in all of life','Can reach extraordinary levels of mastery through committed self-development'],
    challenges:['The weight of constant responsibility must be actively and consciously managed','Must guard against the inner critic turning the same high standards against the self','Learning to surrender to what the path truly asks, rather than resist it'] },
  { rank:'J',  suit:'spades',   sym:'♠', name:'Jack of Spades',   dates:'',
    teaser:'The Divine Trickster, the actor and the initiate, brimming with creative power not yet claimed and a path that is genuinely yours to choose. Genius and charisma are real here, but they are not yet wisdom, and wisdom is exactly what this card came to earn.',
    kws:['Creativity','Spiritual initiation','Rebellion','Self-discovery'],
    personality:'The card of the actor, the thief, and the spiritual initiate, the Jack of Spades is the Divine Trickster of the deck, brimming with creative potential and mental power not yet fully claimed. This card can become the King of Spades, a powerful and responsible leader, or a crafty figure who cannot be trusted; the path is genuinely the individual\'s to choose. You carry the rare ability to use your mind to initiate almost anything, an irrepressible individualism, and a constant, renewing stream of self-discovery, with enthusiasm that turns to conviction and conviction to success. The shadow is how easily these gifts aim toward the clever shortcut rather than the meaningful life: genius and charisma are real, but they are not yet wisdom, and wisdom is what this card is here to earn.',
    strengths:['Immense creative and mental power across a wide range of expression','Deeply individualistic with a genuine, ever-renewing capacity for self-discovery','Naturally resonant with the public and capable of real artistic or healing success','Innovative in finding new approaches to health, psychology, and self-knowledge'],
    challenges:['This card\'s power can lead to either the highest expression or the most self-destructive','Temptation toward clever shortcuts over genuine depth and earned wisdom','A solid, early-formed value system is essential to where these gifts ultimately land'] },
  { rank:'Q',  suit:'spades',   sym:'♠', name:'Queen of Spades',  dates:'',
    teaser:'Self-mastery is its very name, a quietly formidable card ambitious not for fame but to prove something real to herself, able to take in turmoil and come out wiser. The danger is forgetting the crown, pouring yourself into everyone else\'s needs while your own potential waits.',
    kws:['Ambition','Inner strength','Self-mastery','Resilience'],
    personality:'Self-mastery is the very name and purpose of this quietly formidable card, ambitious not for outer fame but for the deep inner drive to prove something real to herself. A born ruler with unlimited wisdom and intuitive ability available to her, she can take on immense turmoil, learn from it, and emerge genuinely stronger and wiser, even wishing what she desires into being once she claims the power of her own crown. The danger is forgetting that crown, losing yourself in menial tasks or in tending everyone else\'s needs rather than your own potential, so some real mental discipline and focus is essential to your contentment. Your happiness depends on authentic, ongoing growth, and the great work is developing genuine self-love alongside the strength, as its deepest foundation.',
    strengths:['Quietly formidable inner strength and genuine psychological resilience','Driven by self-mastery in the truest sense, not recognition or external validation','Emotionally mature and centred in ways that consistently surprise others','Able to take the most demanding experiences and convert them into lasting wisdom'],
    challenges:['The drive to grow stronger can be pushed so hard it forgets compassion for the self','Must ensure that building resilience doesn\'t mean building walls','Long-term commitments to people, practices, or spiritual paths are the true transformative agent'] },
  { rank:'K',  suit:'spades',   sym:'♠', name:'King of Spades',   dates:'',
    teaser:'Master of the deck and the highest card of all, ruling a single day of the year, one who has endured everything and built something unassailable from it. Its authority runs straight through the deepest limitations a life can hold, turning them, slowly and honestly, into a presence that needs no announcement.',
    kws:['Mastery','Authority','Wisdom','Responsibility'],
    personality:'Master of the deck, the King of Spades governs just one day of the year, January 1st, and in that singular exclusivity lies its entire nature. This is the highest card of all: the master of wisdom and of self-mastery, the ultimate authority, one who has endured everything and built something unassailable from it. Independent and strong-willed, you took on adult responsibility early and carry a weight others cannot imagine; you may value freedom and new horizons over any traditional life, and your solitary, in-your-head nature can read to others as secretive. The path runs straight through the deepest physical, psychological and existential limitations, transforming them, slowly and honestly, into a quiet authority that needs no announcement and commands lasting respect. Note: the King of Spades is a fixed card and a member of the Mystical Family of Seven.',
    strengths:['The pinnacle of authority and accumulated wisdom in the entire deck','Brilliant, strategic mind capable of shouldering the heaviest of burdens','Deeply responsible, resilient, and genuinely protective of those in their care','When fully realised, a presence that commands deep and lasting respect'],
    challenges:['The weight of this card is real and requires sustained, honest inner work throughout life','Reluctance to bend even to constructive guidance; autonomy is a double-edged gift','The path includes serious physical, psychological, and life challenges that cannot be bypassed or rushed'] },
];

// ── Numerology (number-level, keyed by rank) ───────────────────────
// One entry per rank (Ace=1 … King=13), shown for every card of that rank.
// Layers *under* the suit-specific `personality` text — same number reads
// identically across all four suits. Copy is locked Sage voice (see
// uploads/numerology-content.md); grounded in Pythagorean number meanings
// + Olney H. Richmond's "Mystic Test Book" (1890s) face values.
// Courts keep their card value un-reduced: Jack 11, Queen 12, King 13.
const NUMEROLOGY = {
  'A': { n:1, label:'Ace', keywords:['Desire','Self','Beginning','Initiative'],
    text:'One is the single point before anything is shared, the first desire waking in the dark. You are the seed and the will that drives it upward, ambitious, restless to begin, certain the world is yours to start. Everything that follows is only One, divided and learning its way back. Stand in your own power and move. The hunger that says you are whole only when you are seen carries its own truth, that you were never meant to rise alone.',
    keynote:'Begin. You are the seed of all that follows.' },
  '2': { n:2, label:'Two', keywords:['Union','Cooperation','Partnership','Balance'],
    text:'Two is the meeting, the joining of what was apart. Here the One discovers it is not the whole of things, and a bargain is struck, a bond, a letter carried between two hands. You are made for partnership and read the unspoken weather of another with ease, happiest when you are not alone. Your strength is the bridge you become. Your trouble is the fear of standing single, which can bend you where you ought to hold.',
    keynote:'Two becomes strong in the bond, and weak in the fear of breaking it.' },
  '3': { n:3, label:'Three', keywords:['Creation','Expression','Choice','Restlessness'],
    text:'Three is the open mouth and the fork in the road. Out of the union of Two comes a third thing, and with it the gift of making, colour and word and voice pouring out faster than you can shape them. You are bright, quick, alive in company, holding more beginnings than you can ever finish. The two roads opening before you are real, and the worry that freezes you is only your creating force with nowhere to go. Choose one road and pour yourself down it.',
    keynote:'Creation is easy for you. Choosing is the work.' },
  '4': { n:4, label:'Four', keywords:['Foundation','Stability','Order','Endurance'],
    text:'Four is the square standing on the ground, the four corners that hold a thing in place. You build to last, steady and patient, the one others lean their weight against and feel safe. Walls are a blessing while they shelter and a prison once they will not open. Work, then, but watch the part of you that mistakes every change for a threat. What is truly founded does not fear the wind. It bends a little, and it stands.',
    keynote:'Build to last, and leave a door in the wall.' },
  '5': { n:5, label:'Five', keywords:['Change','Freedom','Movement','Seeking'],
    text:'Five is the crossing mark and the open road, the still square broken into motion. You are restless by birth, hungry for the new face, the far country, the thing you have not yet tasted. Movement is your medicine and your snare. The same wind that carries you onward can pull you from the field before the seed you planted breaks the soil. Go far. Then learn the older freedom, the one found by staying long enough for something to grow.',
    keynote:'Go everywhere. Then stay long enough for one thing to bloom.' },
  '6': { n:6, label:'Six', keywords:['Harmony','Responsibility','Cause and Effect','Service'],
    text:'Six is the level road and the returning scale. For a while the line runs straight and quiet, and in that quiet the law works: what you gave comes back to your door, the good of it and the cost of it alike. You are the one who heals the room, who carries the weight of others and calls it love. Tend that, but do not let peace become the thing you keep by never acting. What balance asks of you now is the courage to move.',
    keynote:'What you give returns. So give, and then act.' },
  '7': { n:7, label:'Seven', keywords:['Spirit','Trial','Faith','Inner Sight'],
    text:'Seven stands at the still center, the most inward of all the numbers. Something here blocks the way, and it will not yield to force or to argument. Met head on it is only trouble. Turn, come at it from another side, by trust in place of fear, and the wall you could not pass was never a wall. You are tuned to what others cannot hear. Stop demanding proof of the knowing that is already yours, and the victory comes quiet, and it is spiritual, and it is won over no one but yourself.',
    keynote:'The obstacle dissolves the moment you meet it by faith.' },
  '8': { n:8, label:'Eight', keywords:['Power','Mastery','Accomplishment','Abundance'],
    text:'Eight is power that has learned its own name. The doubled square, the standing strength, you set your will on a thing and it moves, in the body, in the work, in the gathering of many around you. Fortune leans your way. Yet power undirected hardens, turns to control, closes the hand it should hold open. Aim it well and keep it open, and what you build blesses everyone it touches. Mastery is yours. Domination is the counterfeit that costs you the very thing you mastered it for.',
    keynote:'Power blesses when it stays open and ruins when it closes.' },
  '9': { n:9, label:'Nine', keywords:['Completion','Release','Compassion','Letting Go'],
    text:'Nine is the circle closing, the last step before the cycle turns over again. You came to give, to love past the borders most people draw, and your hardest lessons arrive through what you must let go. Fulfilment is promised here, yet it so often comes dressed as loss, the thing held too tightly slipping the grip. This is the hardest grace, to give freely and then release the giving. Loosen your hands. What you let go does not leave you. It returns enlarged.',
    keynote:'Give freely, and let go of the giving.' },
  '10': { n:10, label:'Ten', keywords:['Success','Fullness','Attainment','Renewal'],
    text:'Ten is the full harvest, success standing on every side of you. The cycle that began as One returns here complete, crowned, richer for all it passed through. Stand in it. But the same number folds back to the One, which makes this fullness a first step as much as a summit, never a place to merely rest. Wear the success lightly and keep moving. The ease it brings is a gift, and lean on it too long and it becomes a slow forgetting of how you earned it.',
    keynote:'The harvest is also a seed. Do not rest in it.' },
  'J': { n:11, label:'Jack', keywords:['Youth','Creativity','Initiation','Maturity'],
    text:'Eleven is the bright apprentice, the young fire that arrives gifted past its years. You see what could be, and you see it early, quick with vision and charm, holding everything except the maturity you are here to earn. Two roads stand open. Learn through experience, train the gift, and grow into a true power. Or live on cleverness alone and stay the wanderer who never quite lands. The brilliance was never in question. What it waits for is your word that you will grow up around it.',
    keynote:'The gift is given young. The maturity, you earn.' },
  'Q': { n:12, label:'Queen', keywords:['Receptive Power','Love','Nurture','Inner Authority'],
    text:'Twelve is the throne that rules by giving. Here is love made into mastery, the power that nurtures, receives, and holds the room together without ever raising its voice. You carry real authority, though it often goes unnamed, the steady hand behind what others are credited for. Pour your warmth outward, you were made for it. Only see that some of it turns back toward you. The one who gives forever and is never given to cannot sustain the love that holds everything else up.',
    keynote:'You rule by giving. Let some of the love flow home.' },
  'K': { n:13, label:'King', keywords:['Mastery','Authority','Rule','The Summit'],
    text:'Thirteen is the crown, the number where a thing comes into its full power and rules. Whatever your nature, here it reaches its height and takes command, sure of itself, bound by no one’s doctrine but its own. This is real authority, the kind others feel without being told. Yet the crown stays only on the head that keeps earning it. Rule, but question yourself as fiercely as you question the world, and shed what you have outgrown. The king who stops remaking himself hardens into the very thing he rose to master.',
    keynote:'Wear the crown by remaking the head that wears it.' }
};
window.NUMEROLOGY = NUMEROLOGY;

// ── Suit meanings (keyed by suit) ──────────────────────────────────
// Shown in the finder profile beside Numerology. Locked Sage voice; same
// shape as NUMEROLOGY. The Joker has no suit entry (section hides for it).
const SUIT_MEANINGS = {
  hearts: { sym:'♥', label:'Hearts', keywords:['Love','Feeling','Connection','Devotion'],
    text:'Hearts is the suit of love, and love is the element you were poured from. You feel first and reason after, and what you feel runs warm and deep and close to the surface, so the people near you become the weather of your days. Your gift is connection, the rare power to meet another and let them be truly met. Tend the spring at your center and give from its overflow, never its floor, and the warmth you spend returns to you many times over. The danger is losing your own banks inside someone else, for love without shores floods the very ground it meant to feed.',
    keynote:'Love is your element. Give from the overflow, never the floor.' },
  clubs: { sym:'♣', label:'Clubs', keywords:['Mind','Knowledge','Word','Curiosity'],
    text:'Clubs is the suit of the mind, and yours is quick, bright, and seldom still. You live by ideas and by the words that carry them, hungry to know, to question, to see the workings beneath the surface of things. Truth has weight for you, and so does speech, for what you say can build a person up or cut them down. Feed the curiosity and follow a single thought to its end before you reach for the next, and your knowing ripens into wisdom others come to trust. Left scattered, the same bright mind spins in worry and noise, full of beginnings and starved of rest.',
    keynote:'Your mind is the gift. Follow one thought all the way down.' },
  diamonds: { sym:'♦', label:'Diamonds', keywords:['Value','Worth','Exchange','Abundance'],
    text:'Diamonds is the suit of value, and you came to learn what things are truly worth, yourself most of all. You have a clear eye for quality and a natural feel for exchange, for turning effort into something solid you can hold and share. Money and the material are honest teachers for you, yet the deeper lesson is the worth no ledger counts, the value of your hours, your gifts, and the people you will never trade away. Know what you are worth and ask for it plainly, and abundance comes as a matter of course. The shadow is pricing everything until the priceless slips through your fingers.',
    keynote:'Know your true worth, then ask for it plainly.' },
  spades: { sym:'♠', label:'Spades', keywords:['Wisdom','Work','Mastery','Transformation'],
    text:'Spades is the suit of wisdom, the deepest and most demanding of the four, and you were handed the heaviest tools. Yours is the work that transforms, the labor of the hands and of the spirit at once, and you carry a quiet certainty that real things are earned. Difficulty is your forge. What you pass through, you master, and what you master, you become. Give yourself to the work with patience and honesty, and you turn even hardship into an authority no one can take from you. Set the labor down and the same suit grows heavy, a weight carried with no ground gained.',
    keynote:'You were given the deepest work. Through it, you are made.' }
};
window.SUIT_MEANINGS = SUIT_MEANINGS;

// ── Card Subtitles, Vows, Life Scripts ─────────────────────────────
const SUBTITLES = {
  'A_hearts':   'The Quickening Flame',  '2_hearts':  'The Twin Flame',
  '3_hearts':   'The Wavering Flame',    '4_hearts':  'The Guarded Flame',
  '5_hearts':   'The Wandering Flame',   '6_hearts':  'The Faithful Flame',
  '7_hearts':   'The Dreaming Heart',    '8_hearts':  'The Magnetic Heart',
  '9_hearts':   'The All-Loving Heart',  '10_hearts': 'The Radiant Host',
  'J_hearts':   'The Ardent Youth',      'Q_hearts':  'The Mother of Flame',
  'K_hearts':   'The Lord of Flame',

  'A_clubs':    'The Waking Word',       '2_clubs':   'The Whispered Accord',
  '3_clubs':    'The Threefold Doubt',   '4_clubs':   'The Tempered Mind',
  '5_clubs':    'The Wind-Taught Mind',  '6_clubs':   'The Illumined Mind',
  '7_clubs':    'The Inner Oracle',      '8_clubs':   'The Mind Unbound',
  '9_clubs':    'The Mind of Many Lives','10_clubs':  "The Sage's Light",
  'J_clubs':    'The Quicksilver Mind',  'Q_clubs':   'The Oracle Queen',
  'K_clubs':    'The Master of the Word',

  'A_diamonds': 'The First Breath',      '2_diamonds':'The Sacred Clasp',
  '3_diamonds': 'The Trembling Vessel',  '4_diamonds':'The Cornerstone',
  '5_diamonds': 'The Untethered One',    '6_diamonds':'The Even Hand',
  '7_diamonds': 'The Hidden Gold',       '8_diamonds':'The Hand of Plenty',
  '9_diamonds': 'The Open Palm',         '10_diamonds':'The Golden Harvest',
  'J_diamonds': 'The Silver Tongue',     'Q_diamonds':'The Keeper of Beauty',
  'K_diamonds': 'The Lord of Plenty',

  'A_spades':   'The Opening Gate',      '2_spades':  'The Companion Soul',
  '3_spades':   'The Vale of Sorrows',   '4_spades':  'The Keeper of the Law',
  '5_spades':   'The Stormbringer',      '6_spades':  'The Wheel of Fate',
  '7_spades':   'The Dark Night of the Soul', '8_spades': 'The Adamant Will',
  '9_spades':   'The Great Reckoning',   '10_spades': 'The Crown of Toil',
  'J_spades':   'The Shadow Walker',     'Q_spades':  'The Veiled Crone',
  'K_spades':   'The Grand Magus',

  '✦_joker':    'Quinta Essentia',
};

// ── Card Vows (Mottos) ───────────────────────────────────────────
const VOWS = {
  'A_hearts':   'I am the first warmth that wakes the heart.',
  '2_hearts':   'I am made whole in the meeting of another.',
  '3_hearts':   'I burn in three directions and must choose one.',
  '4_hearts':   'I keep the hearth so others may come home.',
  '5_hearts':   'I follow my longing wherever it leads.',
  '6_hearts':   'I love steadily, and ask the same in return.',
  '7_hearts':   'I believe in what I have not yet seen.',
  '8_hearts':   'I draw to me what I most deeply feel.',
  '9_hearts':   'I open my arms to all and keep nothing back.',
  '10_hearts':  'I gather the many and we shine as one.',
  'J_hearts':   'I love with the whole fire of the first time.',
  'Q_hearts':   'I hold the fire that warms all who come near.',
  'K_hearts':   'I rule my heart, and so I rule with mercy.',

  'A_clubs':    'I am the question that begins all knowing.',
  '2_clubs':    'I am the truth two minds discover together.',
  '3_clubs':    'I learn by holding the question open.',
  '4_clubs':    'I am the calm that thought returns to.',
  '5_clubs':    'I learn from everything I cannot hold.',
  '6_clubs':    'I see clearly, and light the way for others.',
  '7_clubs':    'I trust the voice beneath my thoughts.',
  '8_clubs':    'I bend the world with the force of my thought.',
  '9_clubs':    'I remember more than this one life has taught.',
  '10_clubs':   'I carry the knowing of those who came before.',
  'J_clubs':    'I move faster than the world expects.',
  'Q_clubs':    'I know without being told.',
  'K_clubs':    'My word orders the world around me.',

  'A_diamonds': 'I am the spark that enters flesh.',
  '2_diamonds': 'I am the hand that holds and is held.',
  '3_diamonds': 'I steady my hands against the fear of want.',
  '4_diamonds': 'I am the ground that bears the weight.',
  '5_diamonds': 'I risk the known to find the more.',
  '6_diamonds': 'I give what is owed and take what is mine.',
  '7_diamonds': 'My worth is not measured by what I hold.',
  '8_diamonds': 'What I touch with intention multiplies.',
  '9_diamonds': 'I release what is finished and am made lighter.',
  '10_diamonds':'I reap in full what I planted in faith.',
  'J_diamonds': 'I speak, and the door opens.',
  'Q_diamonds': 'I make a sanctuary of all I tend.',
  'K_diamonds': 'I command abundance and steward it well.',

  'A_spades':   'I am the soul that turns toward the light.',
  '2_spades':   'I do not walk the road alone.',
  '3_spades':   'I pass through grief and am not undone.',
  '4_spades':   'I stand by what is true when it costs me.',
  '5_spades':   'I break what is stagnant so it may live again.',
  '6_spades':   'I meet what returns to me and call it justice.',
  '7_spades':   'I walk the dark until it becomes my teacher.',
  '8_spades':   'I cannot be broken by what I refuse to fear.',
  '9_spades':   'I let the old self die so the new may rise.',
  '10_spades':  'I earn my light through the labor of my hands.',
  'J_spades':   'I move unseen between the worlds.',
  'Q_spades':   'I have seen the far side and returned with wisdom.',
  'K_spades':   'I have mastered the self, and so the rest follows.',

  '✦_joker':    'I am bound by nothing and present in all.',
};

// ── Relationship texts (REL_TEXT) ────────────────────────────────
// The bond itself: the result card of a relationship reading, voiced as
// the character of the pairing (Sage speaks to "the two of you").
// Keyed `rank_suit` like SUBTITLES. 52 entries; the Joker can never be a
// result. Entry shape: { syn: "italic synopsis line", text: "one paragraph" }.
// Written 2026-06-11 (max-mode pass), strict sage-voice register.
const REL_TEXT = {
  'A_hearts': {
    syn: "Something new is lit between you, and it has never burned before.",
    text: "This bond is a beginning that stays a beginning. Whatever the two of you have been elsewhere, here you are first warmth, first nerve, the held breath before a word. Feed it small and feed it often: the early fire takes kindling, never logs. Let yourselves be new with each other even in the tenth year. The risk is impatience, asking the spark to heat the whole house before it has caught." },
  '2_hearts': {
    syn: "Two made for facing each other. The oldest shape love takes.",
    text: "This is the card of the pair itself: two cups, one table. Between you runs a current that asks for nothing added, no audience, no third thing to justify it. Your work is simply to keep facing each other when the world supplies a hundred reasons to face away. Guard the hours that belong only to the two of you. What dims this bond is never distance; it is company kept carelessly." },
  '3_hearts': {
    syn: "A heart's abundance moves between you, more than two hands can hold.",
    text: "Together you generate more feeling than the bond can spend: enthusiasms, attachments, sudden tendernesses for the whole world. This is wealth. Spend it outward, on the people and works you warm together, and the wavering steadies into brightness. Held too tightly it turns to doubt, each of you counting the other's glances. Choose, daily, where this shared heart points, and let the choosing be done out loud." },
  '4_hearts': {
    syn: "A hearth with walls. Love that holds because it is held.",
    text: "The two of you make a room the world cannot enter without knocking. Safety is this bond's gift and its language: meals kept, returns expected, a warmth that does not flicker when the weather turns. Build the walls and keep a door in them. Invite, host, send each other out and welcome each other back. Sealed too long, the snug room goes airless and the fire that wanted only to be safe goes small." },
  '5_hearts': {
    syn: "A love that keeps moving. The road is part of the vow.",
    text: "This bond will not sit still, and it was never meant to. Together you are restless in the heart, hungry for the next coast, the next chapter, the next version of each other. Honor that by changing together, on purpose, before life changes you separately by force. Plan departures; make leaving a shared art. Mourned as instability, the motion sours. Ridden as weather, it keeps the two of you young." },
  '6_hearts': {
    syn: "A steady flame between you, tended by promise rather than mood.",
    text: "What joins you here is constancy, love as a kept appointment. The bond does not surge and crash; it accrues, the way a hearth warms a stone house, season over season. Your one law is reciprocity: each gives the warmth each asks. Speak when the scales drift, because this card keeps accounts in silence, and silence compounds. Tended evenly, this is the love others rest their doubts against." },
  '7_hearts': {
    syn: "A bond that asks for faith past what the eye can verify.",
    text: "Between the two of you stands a gap that proof will never close: trust crosses it or nothing does. This bond practices believing in a person ahead of the evidence, loving the one they are becoming as loyally as the one they are. That faith is the whole craft, and it must run both ways. The trial of this card is disappointment used as doctrine. Let each lapse be one lapse. Keep believing larger than you fear." },
  '8_hearts': {
    syn: "A pull neither of you decided on. The bond itself has gravity.",
    text: "Together you are magnetic, to each other first and then to everyone near you. Rooms arrange themselves around the two of you; people warm their hands at your company. Such power asks for clean intent: draw toward yourselves only what you mean to keep, and notice what your shared mood summons, because it summons exactly. Used carelessly, the pull becomes performance and the audience replaces the beloved. Turn the magnet inward often." },
  '9_hearts': {
    syn: "Love with open hands. This bond completes by giving itself away.",
    text: "This is a giving bond, ripened past possession. The two of you are at your truest when the love between you spills its banks: feeding others, forgiving fast, releasing every version of each other that has finished. Some chapters of this union exist to be completed and laid down, and laying them down is the love. Hold the bond with open palms. Grasped, it grieves; given room, it returns on its own, fuller." },
  '10_hearts': {
    syn: "Two who become a gathering. Your love sets a long table.",
    text: "This bond was never built for two alone; it hosts. Around you accumulate the loved: family, friends, strays adopted mid-winter, the whole bright crowd your union convenes. Fullness is the gift. The discipline is the center, because a house of many rooms still needs its hearth, and the two of you are it. Withdraw together regularly, out of the lamplight, so the hosts do not vanish into the feast." },
  'J_hearts': {
    syn: "First love, kept first. The bond refuses to grow old.",
    text: "Whatever your ages, this union is young and stays young: impulsive, devoted, a little theatrical, in love with being in love. That ardor is holy. It is also untrained, and it will gust. Sacrifice is this card's secret spine: the young heart proves itself by what it gladly gives up. Make the grand gestures and also the small unglamorous ones. Play kept kind keeps the fire; play turned careless burns the curtains." },
  'Q_hearts': {
    syn: "A bond that mothers. Each of you is tended, and tends.",
    text: "Between you flows the warm authority of the hearthkeeper: feeding, soothing, remembering the small preferences, holding the fire so others can be weak a while. In this union each of you is sometimes the child, and the trade must stay honest, because a love where one only gives and one only warms will hollow the giver. Mother each other in turns. Done evenly, this bond can raise anything: children, houses, whole lives." },
  'K_hearts': {
    syn: "Mastery of the heart, shared. Love that governs gently.",
    text: "This is love grown sovereign: feeling that has learned command without losing heat. Together you can steer storms that capsize other pairs, because between you sits an adult tenderness, merciful and unembarrassed. The charge that comes with the crown is responsibility for the emotional weather of everyone under your roof. Rule it kindly and never from the throne at each other. Mercy first, in every verdict the two of you hand down." },

  'A_clubs': {
    syn: "It began with a question, and the question is still alive.",
    text: "What joins you is curiosity: the first spark of wanting to know, met in another person. This bond thinks aloud, finishes ideas as often as sentences, falls in love again every time one of you says something the other has never thought. Keep asking first questions, especially the ones you assume you know each other's answers to. The hazard is talk that replaces touch. Let some knowing stay wordless between you." },
  '2_clubs': {
    syn: "Two minds in low agreement. The conversation that needs no raised voices.",
    text: "This is the accord of two minds that fit: dialogue as home. Together you reason, plan, and parse the world, and the talk itself is the intimacy. Such a bond fears nothing outside itself; its one enemy is the argument that stops being a search and becomes a score. When you disagree, stay on the same side of the table, facing the question together. Held that way, no silence between you is ever empty." },
  '3_clubs': {
    syn: "Three roads of thought between two people. The bond that questions everything, including itself.",
    text: "Together you generate possibilities faster than certainties, and the surplus is the point. This union brainstorms, second-guesses, sees every fork in every road, and that triple sight makes you wise counsel for each other when either would settle too soon. The cost is doubt turned on the bond itself, picking at what holds you. Examine everything else in the world together. Let the union itself be the one premise you grant." },
  '4_clubs': {
    syn: "A level table between you where every thought can be set down.",
    text: "This bond is mental ground that does not shake: conclusions reached together, decisions that stay decided, a shared sense that the other's word is load-bearing. You become each other's stillness in noisy seasons, the place reasoning goes to rest. Keep the foundation by keeping it honest, because one quiet withholding cracks this card's whole floor. Beware only the comfort that stops asking. Even a fortress mind needs windows." },
  '5_clubs': {
    syn: "Two minds that must keep traveling, together if they are wise.",
    text: "The thought between you refuses to settle in one school, one story, one town. Together you learn by leaving: changing opinions, fields, sometimes addresses, and bringing the findings home to compare. Make the restlessness a shared expedition and this bond never stales; there will always be a new thing one of you is halfway through understanding. Split, the same wind scatters you. Travel each other's changes side by side." },
  '6_clubs': {
    syn: "Shared sight. Two lamps set level, lighting one road.",
    text: "This bond sees, and is sought for its seeing. Between you grows a steady clarity: values aligned, judgments that arrive together, a light other people borrow when their own gutters. Your responsibility is to keep the lamps trimmed, because illumination untended dims so slowly no one names the day it went. Refresh what you know of each other; yesterday's knowledge must be learned again today. Lit and relit, this union becomes counsel for its whole circle." },
  '7_clubs': {
    syn: "A knowing under the talk. The bond hears what is not said.",
    text: "Between the two of you runs a second conversation, beneath the audible one: hunches about each other that arrive correct, moods read through walls. This bond is intuitive before it is logical, and its trials come when one of you argues the surface while the other has already heard the depth. Believe the underneath voice, and say so plainly. Suspicion is this card's counterfeit; intuition warms, suspicion narrows. Learn the difference together." },
  '8_clubs': {
    syn: "Two wills of mind, fused. What you decide together tends to happen.",
    text: "This is mental power doubled: a union that can hold a thought until the world rearranges around it. Plans the two of you fix on come true at an unsettling rate, so fix carefully. The fixed card does not bend, and neither will either of you in a quarrel; victory between intimates is always a loss. Aim the shared will outward at the work, never across the table. Pointed one way, you are formidable." },
  '9_clubs': {
    syn: "An old acquaintance, older than the introduction.",
    text: "You have the feel of minds that have met before: understandings arriving whole, references that need no footnotes, a strange fluency from the first conversation. This bond completes old curricula. Expect to clear out beliefs together, each of you helping the other lay down ideas worn past use; the discarding is the study. What it asks is generosity with conclusions, teaching what you know without fee. An ending inside this bond is usually a graduation." },
  '10_clubs': {
    syn: "A library with two readers. Knowledge gathered into one keeping.",
    text: "Together you accumulate understanding the way other pairs accumulate furniture: books, crafts, histories, the right way to do a hundred things. This bond is a completed mind in two bodies, and its joy is transmission, teaching each other and then teaching outward. Keep the collection alive by keeping it used; knowledge hoarded goes to dust exactly like linen. Beware the pride of the full shelf. Wisdom still wants wonder, and wonder is each other." },
  'J_clubs': {
    syn: "Quick with each other, quick together. The bond runs ahead of the map.",
    text: "This union is fast: jokes at a glance, plans hatched on staircases, two wits sharpening on each other daily. The speed is real intelligence and real delight, and it skips steps. Together you will improvise past obstacles that stop the methodical, then trip on a detail patience would have caught. Slow down on purpose once a day; let one finished conversation go all the way to the bottom. Quickness kept honest is genius. Kept evasive, it is escape." },
  'Q_clubs': {
    syn: "Known before speaking. A bond that reads its own weather.",
    text: "Between you operates a quiet omniscience: each tends to know the other's state before the door is fully open. Such transparency is rare and it is work to live inside, because nothing can be hidden for kindness either. Agree on what the knowing is for: care, never surveillance. Announce what you see gently, and allow each other the dignity of saying it themselves first. Used tenderly, this bond is the deepest privacy two people can share." },
  'K_clubs': {
    syn: "Two keepers of the word. What you say to each other stands.",
    text: "This bond is governed by language: promises here are architecture, and a sentence can hold weight for years. Together you are articulate, decisive, capable of speaking a shared life into order. The mastery cuts both ways, because a careless word from either of you lands like law and is remembered like law. Spend speech as the currency it is. Retract fully, apologize precisely, and never legislate in anger. Kept clean, your word is the safest place either of you will stand." },

  'A_diamonds': {
    syn: "A first stake in the ground, claimed by two pairs of hands.",
    text: "This bond begins things in the world of things: first ventures, first keys, the desire to make something real together that neither would attempt alone. Its energy is morning energy, ambitious and slightly breathless. Use it to begin, deliberately and often, because this union is happiest with a project on the table. The shadow is appetite that always wants the next acquisition before the last is loved. Finish some things. Hold what you start." },
  '2_diamonds': {
    syn: "A handclasp made binding. Partnership down to the ledger.",
    text: "This is the card of partnership made practical: two names on one undertaking, resources joined, each holding what the other cannot carry that month. The bond thrives on fairness you can point to, work and reward divided in the open. Keep the accounts visible and the gratitude audible, since nothing corrodes a clasp like a kept tally no one admits to keeping. Held in the open, this union compounds; what you build together outlasts what either kept apart." },
  '3_diamonds': {
    syn: "Worth in motion between you, never quite at rest.",
    text: "Together you carry a vessel that trembles: money, security, value itself moving in and out of certainty. This bond knows the fear of want intimately, and its task is to refuse that fear a vote. Together you are more inventive than either alone, three schemes where one would do. Choose among them as partners and the wobble becomes craft. Let the fear decide, and you will clutch, and clutched vessels spill. Steady each other's hands; that is the whole instruction." },
  '4_diamonds': {
    syn: "A foundation laid by four hands. The bond others build upon.",
    text: "What stands between you is structural: a union that pays its bills, keeps its roof tight, and can be leaned on by everyone it shelters. Protection is its language of love, provision its poetry. Honor that language even when it looks unromantic, because the made bed and the kept promise are this card's roses. Guard against weight without windows, providing so dutifully that delight is postponed for decades. Build pleasure into the budget. Cornerstones can hold gardens too." },
  '5_diamonds': {
    syn: "Two hands releasing the rail at the same time.",
    text: "This bond gambles: on moves, on ventures, on each other, trading the secure for the possible again and again. At its best the union is a shared adventure in value, each of you braver about the leap because the other is mid-air too. Agree on the stakes before you jump, every time, since the gravest risk this card runs is one partner wagering what both must repay. Loss will visit; let it find you holding hands. The more you sought was always each other." },
  '6_diamonds': {
    syn: "Accounts kept even. A bond balanced like a well-hung door.",
    text: "Between you operates a precise justice: debts honored, favors returned, the giving and taking weighed by some shared inner scale. This evenness is real peace, the quiet of a door hung true. Its danger is arithmetic replacing affection, love disbursed only upon receipt. Practice the unearned gift regularly; let one of you over-give on purpose and the other simply receive. The scale is a tool of this bond. It must never become its heart." },
  '7_diamonds': {
    syn: "Treasure buried in plain sight between you.",
    text: "This bond's wealth rarely looks like wealth. Its gold is hidden in the unspectacular: solvency of spirit, a partner whose worth the market cannot price, riches that show only when everything priceable is subtracted. Together you will be tested on exactly this, seasons where the visible accounts run thin and the union must remember what it actually holds. Faith in unseen value is the discipline. Audit by candlelight together, often. You are richer than the drawer of receipts suggests." },
  '8_diamonds': {
    syn: "Increase answers the two of you. What you tend together grows.",
    text: "Joined, your hands multiply: enterprises ripen, houses appreciate, the garden simply does better. This is the bond of stewardship rewarded, and the reward is real, recurring, and a little uncanny. The instruction hides in the word intention, because the increase obeys attention and will magnify neglect just as faithfully. Decide together what deserves to grow, and touch that. Prosperity managed as a shared craft frees you; chased as a score, it owns you both." },
  '9_diamonds': {
    syn: "A bond that gains by letting go. The open hand is never empty long.",
    text: "Together you are asked, more than most, to release: possessions, plans, whole architectures of security that have finished their work. This union completes material chapters, and every completion is a making of room. Grieve what goes, briefly and truly, then give it a good farewell; what is released with grace between you returns as lightness, and lightness is this card's fortune. Hoarding, of things or of grievances, is the one poverty that can find you. Keep the palms open. Watch what lands." },
  '10_diamonds': {
    syn: "The full barn. A union that arrives at abundance and must learn to live there.",
    text: "This bond is a harvest: the wagon home full, the work of many seasons standing in the yard. Together you attract completion in material things, and the granted wish is its own examination. Abundance asks who you are when nothing is lacking, and pairs fail that exam more often than they fail droughts. Keep planting; the harvest bond stays sweet only while something is still growing. Share the surplus widely, with both names on the gift. Full barns are for feeding people." },
  'J_diamonds': {
    syn: "Charm doubled. The two of you could talk your way past anything, including each other.",
    text: "This union opens doors: persuasive, sociable, quick to turn strangers into allies and obstacles into anecdotes. The salesman's gift runs through the bond itself, and there is real joy in being so easily delighted by each other. Watch only that the talk stays true at home, because the skill that charms the room can also dodge the reckoning, and two silver tongues can defer one hard conversation for years. Sell each other nothing. Speak plainly indoors, and let the gift work outside." },
  'Q_diamonds': {
    syn: "A made place. Together you turn shelter into sanctuary.",
    text: "This bond tends: rooms, tables, gardens, the bodies and spirits inside its keeping. Together you have the gift of making life beautiful at the level of the everyday, the meal that is somehow an occasion, the house that exhales when you enter it. Such generosity is the love language of this card, and it costs; keepers tire. Tend the tenders, and let some days be plain without calling them failures. A sanctuary is for resting in. Remember to rest in yours." },
  'K_diamonds': {
    syn: "Stewards of much, together. A union with the keys to the storehouse.",
    text: "This is mastery in the realm of worth: a bond that administers, provides, and decides, with real means moving under its signature. Together you carry authority over resources and the people downstream of them, and the union's character shows in how that weight is shared at home. Trade the crown freely between you; a bond with one permanent treasurer breeds one permanent supplicant. Generosity is the discipline that keeps plenty from hardening. Stewarded openly, your table feeds generations." },

  'A_spades': {
    syn: "A gate opens where you two meet. The deep work begins together.",
    text: "This bond is an initiation. Something in each of you turned toward the light at the same moment, and the union itself is the gate you walk through: first honest reckonings, first transformations witnessed by another. Expect depth early, and protect it, because what opens here opens once. The labor is daily and unglamorous, soul work in work clothes. Do not rush the threshold or each other. Gates open at their own hour; your task is to arrive together." },
  '2_spades': {
    syn: "Shoulder to shoulder. The work divides, the road does not.",
    text: "This is companionship at its barest and strongest: two who labor side by side, matched in pace, alternating the lead without ceremony. The bond is built in shared effort, the moving of actual weight, and its trust is the trust of the rope between climbers. Keep working on common things; idleness estranges this pair faster than hardship ever will. Disputes settle quickest with tools in hand. Walk in step, and the long road becomes the home." },
  '3_spades': {
    syn: "A bond forged where it hurts. Sorrow shared until it halves.",
    text: "Grief moves through this union, and the union is built for it. Together you can sit with what others flee: losses named at the kitchen table, fears given air, the body's troubles met as common cause. The strange gift is intimacy of a depth fair-weather pairs never reach. Take turns being the strong one; sorrow shared is halved only when the carrying alternates. Guard against making the wound your only meeting place. Go find joys together with the same courage." },
  '4_spades': {
    syn: "A vow with foundations. The bond keeps its own law.",
    text: "Between you stands a law the two of you wrote without noticing: things that are simply done and simply never done, a rightness kept even when no one would catch the lapse. This bond is integrity made mutual, rest earned through order, the deep sleep of people who trust each other's spine. Its danger is rigidity, the rule outliving the love that made it. Review the law together, aloud, and amend what has stopped serving. Then keep it absolutely." },
  '5_spades': {
    syn: "Change keeps this union alive. Together you break what has stopped breathing.",
    text: "This bond overturns: habits, houses, versions of yourselves that have quietly died and not yet been buried. Upheaval visits the two of you on a schedule, and treated rightly it is renewal, the storm that returns the air. Learn to recognize stagnation early and break it together, by choice, before the card breaks it for you. Never aim the storm at each other; raze the arrangement, spare the person. What you rebuild after each clearing is the marriage, again, on purpose." },
  '6_spades': {
    syn: "What turns between you was set turning long ago.",
    text: "This union runs on a deep track: consequences arriving on time, what each gives returning with interest, a sense shared by both of you that this meeting was kept rather than made. Fate is this card's word for cause and effect with a long memory. Live inside it deliberately. Sow only what you are willing to harvest in ten years, in each other and in the world. The wheel cannot be argued with, only loaded well. Load it with kindness and let it turn." },
  '7_spades': {
    syn: "A bond tempered in the dark, and brighter for it.",
    text: "This union will be tested where sight fails: seasons when faith in each other must operate without evidence, when one of you walks a darkness the other can only stand beside. Stand beside. That is the entire teaching, and pairs who learn it come out tempered, carrying a trust no bright season could have forged. Resist the suspicion the dark breeds; it is weather. Name your fears to each other before they ferment into accusations. The night ends. The teaching stays." },
  '8_spades': {
    syn: "Unbreakable, if you both face outward.",
    text: "This bond has the deck's hardest spine: two wills that cannot be moved by siege, scarcity, or anyone's opinion. Trouble that dissolves other unions barely scratches the enamel of this one, and you both know it. The single danger is internal, the day those wills lock against each other, because neither of you yields and the adamant becomes the cage. Decide early what is worth winning, and let it never be a fight with each other. Faced outward, nothing breaks you." },
  '9_spades': {
    syn: "Old selves end inside this bond, and that is its mercy.",
    text: "This union is a place where deaths are permitted: the careers, certainties, and former selves each of you must shed get to die here, witnessed, instead of dragging on unburied. Heavy gift, real gift. Expect to grieve together more than once and to be remade together more than once. Hold the funerals properly, with honor for what served its term. The failure of this card is clinging, resuscitating what has finished because the ending frightens you. Let it end. Watch what rises." },
  '10_spades': {
    syn: "A union built like a cathedral: slowly, stone by carried stone.",
    text: "Work is this bond's liturgy. Together you accomplish, shoulder loads, finish what the inspired abandon, and your love declares itself in labor more fluently than in language. There is a crown at the end of such toil and it is real: the standing thing, made together, that no easy union ever raises. Watch only that the scaffolding does not become the life; a cathedral built by two people who forgot to meet inside it stands hollow. Rest is part of the building. Take it together." },
  'J_spades': {
    syn: "Two who know each other's hidden rooms.",
    text: "This bond traffics in the concealed: each of you sees the version of the other that public life never meets, the unlit corridors, the disowned wishes, the humor too dark for company. Such mutual seeing is its own fidelity, the spy's loyalty, deeper than the diplomat's. Keep faith with the secrets without keeping secrets from each other; the line is thin and this card lives on it. Practiced cleanly, your union is the rarest shelter: a place to be wholly unhidden." },
  'Q_spades': {
    syn: "Wisdom keeps this house. A bond that has seen, and stays.",
    text: "There is age in this union beyond its years: a knowing quality, as if the bond itself had already weathered what you are only now entering. Together you possess uncommon discernment, the eye that sorts true from costume in people and plans alike. Others bring you their tangles; untangle your own first. The veil's danger is distance, wisdom used as a wall against being touched. Lift it for each other nightly. The crone's secret was always tenderness, kept where only the worthy find it." },
  'K_spades': {
    syn: "The deck's summit, climbed by two.",
    text: "This is the most demanding bond in the deck and the most accomplished: two sovereignties in one kingdom, mastery met with mastery. Nothing about it is casual. Together you can govern enterprises, weather anything, and hold a standard most pairs cannot see from where they stand. The cost is the crown's old loneliness, two rulers forgetting to be lovers. Abdicate nightly. Let the kingdom run unattended an hour while you are merely two people. The summit is shared or it is not reached." },
};
window.REL_TEXT = REL_TEXT;

// ── Life Scripts ─────────────────────────────────────────────────
// Script order in array: [Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune]
// Display order in modal: Neptune → Mercury (left → right), matching the Quadration grid.
const LIFE_SCRIPTS = {
  'A_hearts':  ['A♦','Q♦','5♥','3♣','3♠','9♥','7♣'],
  '2_hearts':  ['K♥','K♦','6♥','4♣','2♦','J♠','8♣'],
  '3_hearts':  ['A♣','Q♣','10♠','5♣','3♦','A♠','7♥'],
  '4_hearts':  ['4♦','2♠','8♥','6♣','6♠','Q♥','10♣'],
  '5_hearts':  ['3♣','3♠','9♥','7♣','5♦','Q♠','J♣'],
  '6_hearts':  ['4♣','2♦','J♠','8♣','6♦','4♠','10♥'],
  '7_hearts':  ['7♦','5♠','J♥','9♣','9♠','2♥','K♥'],
  '8_hearts':  ['6♣','6♠','Q♥','10♣','8♦','K♠','3♥'],
  '9_hearts':  ['7♣','5♦','Q♠','J♣','9♦','7♠','2♣'],
  '10_hearts': ['10♦','8♠','A♥','A♦','Q♦','5♥','3♣'],
  'J_hearts':  ['9♣','9♠','2♥','K♥','K♦','6♥','4♣'],
  'Q_hearts':  ['10♣','8♦','K♠','3♥','A♣','Q♣','10♠'],
  'K_hearts':  ['K♦','6♥','4♣','2♦','J♠','8♣','6♦'],

  'A_clubs':   ['Q♣','10♠','5♣','3♦','A♠','7♥','7♦'],
  '2_clubs':   ['K♣','J♦','4♥','4♦','2♠','8♥','6♣'],
  '3_clubs':   ['3♠','9♥','7♣','5♦','Q♠','J♣','9♦'],
  '4_clubs':   ['2♦','J♠','8♣','6♦','4♠','10♥','10♦'],
  '5_clubs':   ['3♦','A♠','7♥','7♦','5♠','J♥','9♣'],
  '6_clubs':   ['6♠','Q♥','10♣','8♦','K♠','3♥','A♣'],
  '7_clubs':   ['5♦','Q♠','J♣','9♦','7♠','2♣','K♣'],
  '8_clubs':   ['6♦','4♠','10♥','10♦','8♠','A♥','A♦'],
  '9_clubs':   ['9♠','2♥','K♥','K♦','6♥','4♣','2♦'],
  '10_clubs':  ['8♦','K♠','3♥','A♣','Q♣','10♠','5♣'],
  'J_clubs':   ['9♦','7♠','2♣','K♣','J♦','4♥','4♦'],
  'Q_clubs':   ['10♠','5♣','3♦','A♠','7♥','7♦','5♠'],
  'K_clubs':   ['J♦','4♥','4♦','2♠','8♥','6♣','6♠'],

  'A_diamonds':  ['Q♦','5♥','3♣','3♠','9♥','7♣','5♦'],
  '2_diamonds':  ['J♠','8♣','6♦','4♠','10♥','10♦','8♠'],
  '3_diamonds':  ['A♠','7♥','7♦','5♠','J♥','9♣','9♠'],
  '4_diamonds':  ['2♠','8♥','6♣','6♠','Q♥','10♣','8♦'],
  '5_diamonds':  ['Q♠','J♣','9♦','7♠','2♣','K♣','J♦'],
  '6_diamonds':  ['4♠','10♥','10♦','8♠','A♥','A♦','Q♦'],
  '7_diamonds':  ['5♠','J♥','9♣','9♠','2♥','K♥','K♦'],
  '8_diamonds':  ['K♠','3♥','A♣','Q♣','10♠','5♣','3♦'],
  '9_diamonds':  ['7♠','2♣','K♣','J♦','4♥','4♦','2♠'],
  '10_diamonds': ['8♠','A♥','A♦','Q♦','5♥','3♣','3♠'],
  'J_diamonds':  ['4♥','4♦','2♠','8♥','6♣','6♠','Q♥'],
  'Q_diamonds':  ['5♥','3♣','3♠','9♥','7♣','5♦','Q♠'],
  'K_diamonds':  ['6♥','4♣','2♦','J♠','8♣','6♦','4♠'],

  'A_spades':  ['7♥','7♦','5♠','J♥','9♣','9♠','2♥'],
  '2_spades':  ['8♥','6♣','6♠','Q♥','10♣','8♦','K♠'],
  '3_spades':  ['9♥','7♣','5♦','Q♠','J♣','9♦','7♠'],
  '4_spades':  ['10♥','10♦','8♠','A♥','A♦','Q♦','5♥'],
  '5_spades':  ['J♥','9♣','9♠','2♥','K♥','K♦','6♥'],
  '6_spades':  ['Q♥','10♣','8♦','K♠','3♥','A♣','Q♣'],
  '7_spades':  ['2♣','K♣','J♦','4♥','4♦','2♠','8♥'],
  '8_spades':  ['A♥','A♦','Q♦','5♥','3♣','3♠','9♥'],
  '9_spades':  ['2♥','K♥','K♦','6♥','4♣','2♦','J♠'],
  '10_spades': ['5♣','3♦','A♠','7♥','7♦','5♠','J♥'],
  'J_spades':  ['8♣','6♦','4♠','10♥','10♦','8♠','A♥'],
  'Q_spades':  ['J♣','9♦','7♠','2♣','K♣','J♦','4♥'],
  'K_spades':  ['3♥','A♣','Q♣','10♠','5♣','3♦','A♠'],
};

const LS_SUIT_FROM_SYM = { '♥':'hearts', '♦':'diamonds', '♣':'clubs', '♠':'spades' };

function lsParseCard(str) {
  const sym = str.slice(-1);
  return { rank: str.slice(0, -1), sym, suit: LS_SUIT_FROM_SYM[sym] };
}

// ── Annual Spread Data ──────────────────────────────────────────────
const SPREAD_SUITS  = ['hearts','clubs','diamonds','spades'];
const SPREAD_SYMS   = { hearts:'♥', clubs:'♣', diamonds:'♦', spades:'♠' };
const SPREAD_RANKS  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SPREAD_PLANETS = ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune'];
const SPREAD_PLANET_SYM = { Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Crown:'♛' };

// 52 cards in solar order (Hearts A-K, Clubs A-K, Diamonds A-K, Spades A-K)
const SPREAD_CARDS = [];
SPREAD_SUITS.forEach(suit => {
  SPREAD_RANKS.forEach(rank => {
    SPREAD_CARDS.push({ suit, rank, sym: SPREAD_SYMS[suit] });
  });
});

// Quadration permutation, order 90
// P[i]=j : card at solar position i goes to position j after one Quadration
const QUADRATION_P = [
  26,13, 0,42,29,16, 7,45,32,23,10,48,14, 1,
  39,30,17, 4,46,33,20,11,49,36, 2,40,27,18,
   5,43,34,21, 8,50,37,24,41,28,15, 6,44,31,
  22, 9,47,38,25,12, 3,19,35,51
];

const _spreadCache = {};
function deckAtAge(age) {
  age = ((age % 90) + 90) % 90;
  if (_spreadCache[age]) return _spreadCache[age];
  let perm = Array.from({length: 52}, (_, i) => i);
  let power = QUADRATION_P.slice();
  let n = age;
  while (n > 0) {
    if (n & 1) perm = perm.map(i => power[i]);
    power = power.map(i => power[i]);
    n >>= 1;
  }
  const deck = new Array(52);
  for (let i = 0; i < 52; i++) deck[perm[i]] = i;
  _spreadCache[age] = deck;
  return deck;
}

// ── Pip Layouts and Card Renderer ───────────────────────────────────
// Pip layouts [x%, y%, inverted]
const PIP_LAYOUTS = {
  // Standardized vertical grid: top pip at 8%, bottom at 92% for every card, with
  // rows spaced evenly by count, so same-type columns line up across the deck.
  'A':  [[50,50,0]],
  '2':  [[50,8,0],[50,92,1]],
  '3':  [[50,8,0],[50,50,0],[50,92,1]],
  '4':  [[25,8,0],[75,8,0],[25,92,1],[75,92,1]],
  '5':  [[25,8,0],[75,8,0],[50,50,0],[25,92,1],[75,92,1]],
  '6':  [[25,8,0],[75,8,0],[25,50,0],[75,50,0],[25,92,1],[75,92,1]],
  '7':  [[25,8,0],[75,8,0],[50,29,0],[25,50,0],[75,50,0],[25,92,1],[75,92,1]],
  '8':  [[25,8,0],[75,8,0],[50,29,0],[25,50,0],[75,50,0],[50,71,1],[25,92,1],[75,92,1]],
  '9':  [[25,8,0],[75,8,0],[25,36,0],[75,36,0],[50,50,0],[25,64,1],[75,64,1],[25,92,1],[75,92,1]],
  '10': [[25,8,0],[75,8,0],[50,22,0],[25,36,0],[75,36,0],[25,64,1],[75,64,1],[50,78,1],[25,92,1],[75,92,1]],
  // Court "pips-only" layouts (J=11, Q=12, K=13) — rendered into each court but
  // shown only when body.pips-only is active (the alternate-courts toggle).
  // See pips-only-courts/SPEC.md in the v1 parent folder's dev/ (not in this
  // repo). The King's centre column extends past the
  // pip box (y -5…105) so its five pips don't overlap; they still land in-card.
  'J':  [[25,8,0],[75,8,0],[50,22,0],[25,36,0],[75,36,0],[50,50,0],[25,64,1],[75,64,1],[50,78,1],[25,92,1],[75,92,1]],
  'Q':  [[25,8,0],[50,8,0],[75,8,0],[25,36,0],[50,36,0],[75,36,0],[25,64,1],[50,64,1],[75,64,1],[25,92,1],[50,92,1],[75,92,1]],
  'K':  [[25,8,0],[75,8,0],[50,-5,0],[50,22.5,0],[25,36,0],[75,36,0],[50,50,0],[25,64,1],[75,64,1],[50,77.5,1],[25,92,1],[75,92,1],[50,105,1]],
};

// Court suit-pip placement [x%, y%] — beside the figure's head, in the white gap
// (the second pip is the 180°-rotated mirror beside the other head). All Byron
// Knoll courts share this diagonal layout, so one default covers them; override
// a single card in COURT_PIP_POS if its figure ever needs a different spot.
// Pip SIZE comes from CSS (.court-pip), matched to the number-card pip size.
const COURT_PIP_DEFAULT = [31, 23.1];   // on the number-card grid: x=left column, y=top row (mirror = bottom-right pip)
const COURT_PIP_POS = {};   // e.g. QS: [33, 22] to nudge one card

function spreadCardPips(c) {
  const { rank, sym } = c;
  if (c.suit === 'joker') {
    // Original "Quinta Essentia" art (ours / public domain). The classic Joker
    // corners are drawn live like a court index: a Jack-style "J" (same serif +
    // position as J/Q/K) with "oker" descending vertically, mirrored bottom-right.
    const jokerCorner = (cls) =>
      `<div class="card-corner ${cls}"><span class="cc-rank">J</span>` +
      `<span class="cc-rest">oker</span></div>`;
    return jokerCorner('card-tl') + jokerCorner('card-br') +
      `<img class="court-art" src="assets/cards/JOKER.webp" alt="Joker — Quinta Essentia">`;
  }
  // Corner indices on every card: rank+suit top-left (upright) and bottom-right (rotated)
  const corners =
    `<div class="card-corner card-tl"><span class="cc-rank">${rank}</span></div>` +
    `<div class="card-corner card-br"><span class="cc-rank">${rank}</span></div>`;
  if (['J','Q','K'].includes(rank)) {
    // Illustrated court card (Byron Knoll, public domain) — figure only.
    const courtKey = rank + (c.suit === 'hearts' ? 'H' : c.suit === 'diamonds' ? 'D' : c.suit === 'clubs' ? 'C' : 'S');
    const courtArt = {
      JC: 'assets/cards/JC.webp', JD: 'assets/cards/JD.webp',
      JH: 'assets/cards/JH.webp', JS: 'assets/cards/JS.webp',
      QC: 'assets/cards/QC.webp', QD: 'assets/cards/QD.webp',
      QH: 'assets/cards/QH.webp', QS: 'assets/cards/QS.webp',
      KC: 'assets/cards/KC.webp', KD: 'assets/cards/KD.webp',
      KH: 'assets/cards/KH.webp', KS: 'assets/cards/KS.webp',
    };
    if (courtArt[courtKey]) {
      // Figure-only art: add our themed serif corners + a suit pip (same glyph
      // as the number cards). Default pip sits in the frame's corner triangle;
      // cards in COURT_PIP_POS place it beside the head instead.
      const mark = window.pipMark(sym);
      const pos = COURT_PIP_POS[courtKey] || COURT_PIP_DEFAULT;
      const courtPips =
        `<span class="court-pip" style="left:${pos[0]}%;top:${pos[1]}%">${mark}</span>` +
        `<span class="court-pip" style="left:${100 - pos[0]}%;top:${100 - pos[1]}%;transform:translate(-50%,-50%) rotate(180deg)">${mark}</span>`;
      // Alternate "pips-only" rendering (J/Q/K as pip counts) lives alongside the
      // figure; body.pips-only swaps them via CSS — no re-render needed.
      const altPips = '<div class="card-pips court-only">' +
        (PIP_LAYOUTS[rank] || []).map(([x,y,inv]) =>
          `<span class="pip${inv ? ' inv' : ''}" style="left:${x}%;top:${y}%">${mark}</span>`
        ).join('') + '</div>';
      return corners + courtPips + `<img class="court-art" src="${courtArt[courtKey]}" alt="${rank} of ${c.suit}">` + altPips;
    }
    // Fallback: suit centred between the corner indices
    return corners + `<div class="card-pips"><span class="pip ace" style="left:50%;top:50%">${window.pipMark(sym)}</span></div>`;
  }
  const layout = PIP_LAYOUTS[rank];
  if (!layout) return corners;
  const aceLarge = rank === 'A' && c.suit === 'spades';
  const mark = window.pipMark(sym);
  return corners + '<div class="card-pips">' +
    layout.map(([x,y,inv]) =>
      `<span class="pip${inv?' inv':''}${aceLarge?' ace':''}" style="left:${x}%;top:${y}%">${mark}</span>`
    ).join('') + '</div>';
}

// ── Life Script Renderer ────────────────────────────────────────────
// Render a card's life script row into a host .ls-grid element. Hide the wrap if no script.
// opts (all optional, defaults preserve the original finder behaviour):
//   highlight       {rank, suit} — give that seat a gold connection-shine
//   showPlanetNames true — render the planet name under each glyph
function renderLifeScriptInto(c, host, wrap, opts) {
  if (!host) return;
  opts = opts || {};
  // Joker gets a class on the wrap so its popup drops the "Life Script" heading
  // (see .ccard-life-script.ls-is-joker h4 in cardsoflife.css); cleared below for
  // every real card so a re-used wrap never keeps the joker styling.
  if (wrap) wrap.classList.remove('ls-is-joker');
  if (c.suit === 'joker') {
    if (wrap) { wrap.style.display = ''; wrap.classList.add('ls-is-joker'); }
    host.innerHTML = `<p class="ls-joker-note">The Joker sits above the Sun Line in every Master Script and belongs to no single planetary influence. The 52 cards account for 52 weeks, leaving 1¼ days as remainder. Without a fixed life path, the Joker's work is to consciously choose which card to embody.</p>`;
    return;
  }
  const script = LIFE_SCRIPTS[`${c.rank}_${c.suit}`];
  if (!script) {
    host.innerHTML = '';
    if (wrap) wrap.style.display = 'none';
    return;
  }
  if (wrap) wrap.style.display = '';
  const displayScript = [...script].reverse(); // Neptune first
  const planetOrder = [6,5,4,3,2,1,0]; // index into SPREAD_PLANETS, Neptune → Mercury
  host.innerHTML = displayScript.map((cardStr, i) => {
    const cc = lsParseCard(cardStr);
    const planet = SPREAD_PLANETS[planetOrder[i]];
    const targetIdx = CARDS.findIndex(x => x.rank === cc.rank && x.suit === cc.suit);
    const clickAttr = targetIdx >= 0 ? ` onclick="openCompareCard(${targetIdx})" style="cursor:pointer"` : '';
    const isPick   = opts.highlight && cc.rank === opts.highlight.rank && cc.suit === opts.highlight.suit;
    const pickCls  = isPick ? ' ls-conn-pick' : '';
    // 3-letter planet labels (MER/VEN/MAR/JUP/SAT/URA/NEP) — always fit one line
    // in the compact life-script columns, so they never truncate/overlap even
    // when a browser/OS minimum-font-size (installed apps) enlarges them. Full
    // name kept as a hover/AT tooltip.
    const nameHTML = opts.showPlanetNames ? `<span class="ls-planet-name" title="${planet}">${planet.slice(0,3).toUpperCase()}</span>` : '';
    return `<div class="ls-col">
      <span class="ls-planet" title="${planet}">${SPREAD_PLANET_SYM[planet]}</span>
      ${nameHTML}
      <div class="spread-card ls-card ${cc.suit}${pickCls}"${clickAttr}>${spreadCardPips(cc)}</div>
    </div>`;
  }).join('');
}

// ── Life-script connection between two birth cards ───────────────────
// Is `toCard` one of `fromCard`'s seven planetary cards? If so, return
// which planet seat it occupies, else null. (e.g. 9♦ is J♣'s Mercury card.)
function lifeScriptConnection(fromCard, toCard) {
  const script = LIFE_SCRIPTS[`${fromCard.rank}_${fromCard.suit}`];
  if (!script) return null;
  for (let i = 0; i < script.length; i++) {
    const cc = lsParseCard(script[i]);
    if (cc.rank === toCard.rank && cc.suit === toCard.suit) {
      return { idx: i, planet: SPREAD_PLANETS[i] };
    }
  }
  return null;
}

// Sage-voice gloss for each planetary connection (one card sitting in the
// other's life script). Spoken to "the two of you". Locked register.
const PLANET_CONN_TEXT = {
  Mercury: "Your minds run on one wire. Talk comes quick and easy between you, ideas passed back and forth before either has finished the thought.",
  Venus:   "The warmest of the seats. Affection moves between you without being asked for, and nearness to each other is already its own reward.",
  Mars:    "There is heat here, the kind that drives and the kind that scorches. It moves you both to act, and it will find your tempers where wills cross.",
  Jupiter: "One of you keeps opening doors for the other. Good fortune runs this way, and the bond tends to leave you both larger than it found you.",
  Saturn:  "The heavy seat, and the truest teacher. One of you carries the other's lessons, and the love in it is real but asks to be earned in patience.",
  Uranus:  "An odd, electric current, free and hard to predict. You meet best as equals who hand each other room and ask for none of the usual promises.",
  Neptune: "A dream colours this bond, tender and far-seeing. Hold to what is actually before you, and let the other be a person rather than a wish.",
};
window.PLANET_CONN_TEXT = PLANET_CONN_TEXT;

// ── Planet Label ─────────────────────────────────────────────────────
let _lifeDeckCache = null;
function cardPlanetLabel(idx) {
  if (idx === 52) return '✦ All';  // Joker — outside the planetary spread
  if (!_lifeDeckCache) _lifeDeckCache = deckAtAge(1);
  const pos = _lifeDeckCache.indexOf(idx);
  if (pos >= 49) return `${SPREAD_PLANET_SYM.Crown} Crown`;
  if (pos < 0)   return '';
  const row = SPREAD_PLANETS[Math.floor(pos / 7)];
  const col = SPREAD_PLANETS[pos % 7];
  return `${SPREAD_PLANET_SYM[row]} ${row}  ·  ${SPREAD_PLANET_SYM[col]} ${col}`;
}

// ── Spirit/Life displacement ─────────────────────────────────────────
// In the Life spread each card occupies a seat that, in the Spirit spread,
// belongs to another card: it DISPLACES that card, and is in turn displaced
// by whoever sits in its own Spirit seat. Fixed cards (J♥ 8♣ K♠) keep their
// seat in both spreads; semi-fixed pairs (A♣↔2♥, 7♦↔9♥) trade seats.
function slDisplaces(idx)   { const s = deckAtAge(90), l = deckAtAge(1); return s[l.indexOf(idx)]; }
function slDisplacedBy(idx) { const s = deckAtAge(90), l = deckAtAge(1); return l[s.indexOf(idx)]; }
window.slDisplaces   = slDisplaces;
window.slDisplacedBy = slDisplacedBy;

// ── Card Popup (ccard-overlay) ───────────────────────────────────────
// Small card token (rank + suit symbol) used in the displacement line.
// Clickable (opens that card) unless the page sets window.CC_NO_DISPLACE_LINKS
// — iching's popup is bound to the cast sequence, so jumping cards there
// would desync its line-type footer.
function _ccCardToken(i) {
  const c = SPREAD_CARDS[i];
  if (window.CC_NO_DISPLACE_LINKS)
    return `<span class="cc-dcard ${c.suit}">${c.rank}${c.sym}</span>`;
  return `<button type="button" class="cc-dcard ${c.suit}" onclick="event.stopPropagation(); openCompareCard(${i})">${c.rank}${c.sym}</button>`;
}

// Optional period-reading sources (Daily / 52-Day / Yearly / 7-Year / 13-Year).
// Each file, when a page loads it, exposes window.<X>_CARDS keyed by
// `${rank}_${suit}` with a planets:{Mercury..Neptune} block. The popup uses one
// of these to swap its body text when openCompareCard is given a {period,planet}
// context (see the Personal Cards row); with no context the card's own
// personality text shows as before. Data files are optional — absent on pages
// that don't load them, in which case this just returns null.
const _CC_PERIOD_SOURCES = {
  daily: 'DAILY_CARDS', period: 'PERIOD_CARDS', year: 'YEAR_CARDS',
  seven: 'SEVEN_YEAR_CARDS', thirteen: 'THIRTEEN_YEAR_CARDS',
};
// Short label shown (with the ruling planet) in place of the natal-planet line
// when a period reading is active, e.g. "Today · Mars".
const _CC_PERIOD_LABEL = {
  daily: 'Today', period: 'This period', year: 'This year',
  seven: 'This chapter', thirteen: 'This era',
};
function _ccPeriodReading(c, ctx) {
  if (!ctx || !ctx.period || !ctx.planet) return null;
  const g = _CC_PERIOD_SOURCES[ctx.period];
  const src = g && window[g];
  const entry = src && src[`${c.rank}_${c.suit}`];
  return (entry && entry.planets && entry.planets[ctx.planet]) || null;
}

let _ccCtx = null;
// Popup ‹ › navigation. With a period reading active, the page can take over the
// arrows (e.g. the Daily card walks consecutive days) via window.CC_PERIOD_NAV;
// with no period context they step the deck by solar value, exactly as before.
function ccNavCard(dir) {
  if (_ccCtx && _ccCtx.period && typeof window.CC_PERIOD_NAV === 'function') {
    window.CC_PERIOD_NAV(dir, _ccCtx);
    return;
  }
  openCompareCard((_ccardIdx + dir + CARDS.length) % CARDS.length);
}

function openCompareCard(idx, ctx) {
  _ccardIdx = idx;
  _ccCtx = ctx || null;
  const c = CARDS[idx];
  // Suit class on popup for the accent bar
  const popup = document.getElementById('ccardPopup');
  // If the overlay is already open, this call is a ‹ › step (not a first open):
  // captured before we add .open below so we can cross-fade the content region.
  const _ccStepping = document.getElementById('ccardOverlay').classList.contains('open');
  popup.className = `ccard-popup suit-${c.suit}`;
  const ccFace = document.getElementById('ccFace');
  ccFace.className = `spread-card ${c.suit}`;
  ccFace.innerHTML = spreadCardPips(c);
  document.getElementById('ccName').textContent     = c.name;
  document.getElementById('ccSubtitle').textContent =
    SUBTITLES[`${c.rank}_${c.suit}`] || (c.suit.charAt(0).toUpperCase() + c.suit.slice(1) + ' · ' + c.rank);
  // Dates beneath subtitle. Rendered as individual cells in a fixed 3-column
  // grid (see .ccard-dates in cardsoflife.css) rather than a comma-run of text,
  // so the number of ROWS is deterministic per card (max 6 dates → 2 rows) and
  // NEVER depends on the device's text width — a browser tab and the installed
  // desktop webapp (which renders small text at a different size) lay out
  // identically.
  const ccDates = document.getElementById('ccDates');
  if (ccDates) {
    const parts = (c.dates || '').split(',').map(s => s.trim()).filter(Boolean);
    ccDates.innerHTML = parts.map(d => `<span class="cc-date">${d}</span>`).join('');
  }
  // A period reading (e.g. the Daily card under today's planet) when a
  // {period,planet} context is supplied and a matching entry exists; null
  // otherwise, in which case the popup behaves exactly as before.
  const _periodText = _ccPeriodReading(c, ctx);
  popup.classList.toggle('cc-period', !!_periodText);
  // Keywords slot (removed from popup HTML; kept for backward compat if present)
  const ccKws = document.getElementById('ccKws');
  if (ccKws) ccKws.textContent = _periodText
    ? `${(ctx.label || _CC_PERIOD_LABEL[ctx.period] || '')} · ${ctx.planet}`.replace(/^ · /, '')
    : c.kws.join(' · ');

  // Solar Value: Joker = 0 (Dec 31); others from Richmond data
  const R = window.RICHMOND && window.RICHMOND[`${c.rank}_${c.suit}`];
  const ccSolar = document.getElementById('ccSolar');
  if (ccSolar) ccSolar.textContent = c.suit === 'joker' ? '0' : (R ? R.solar : '—');

  // Planet stat — always show the card's own planetary position (period
  // popups used to hide this; now they match the main compare-card popup).
  document.getElementById('ccPlanets').textContent = cardPlanetLabel(idx);
  // Displacement stat — compact form. Joker (idx 52) has no seat, so still
  // blank for that one; everything else (including period popups) gets the
  // displaces / displaced-by line.
  const dEl = document.getElementById('ccDisplace');
  if (dEl) {
    if (idx >= 52) {
      dEl.innerHTML = '';
    } else {
      const dI = slDisplaces(idx), bI = slDisplacedBy(idx);
      if (dI === idx)      dEl.textContent = 'Fixed';
      else if (dI === bI)  dEl.innerHTML = `Semi-fixed · ${_ccCardToken(dI)}`;
      else                 dEl.innerHTML = `Replaces ${_ccCardToken(dI)} · Replaced by ${_ccCardToken(bI)}`;
    }
  }
  // Two mutually-exclusive body modes:
  //  • In Time period popup (_periodText set): show the period reading prose,
  //    and hide the Life Script.
  //  • Plain card popup: drop the personality/teaser prose entirely and show
  //    the Life Script instead.
  const isPeriod = !!_periodText;
  const ccBody = popup.querySelector('.ccard-body');
  const ccPers = document.getElementById('ccPersonality');
  if (ccPers) ccPers.innerHTML = isPeriod ? `<p style="margin:0 0 .9em">${_periodText}</p>` : '';
  if (ccBody) ccBody.style.display = isPeriod ? '' : 'none';
  // Life Script (moved here from the Finder result 2026-07-06). No-ops safely if
  // the popup host is absent (e.g. iching.html's popup has no #ccLifeScript).
  // Shown only for plain card popups — hidden in the In Time period popups.
  const ccLsHost = document.getElementById('ccLifeScript');
  const ccLsWrap = document.getElementById('ccLifeScriptWrap');
  if (isPeriod) {
    if (ccLsHost) ccLsHost.innerHTML = '';
    if (ccLsWrap) ccLsWrap.style.display = 'none';
  } else {
    renderLifeScriptInto(c, ccLsHost, ccLsWrap, { showPlanetNames: true });
  }
  document.getElementById('ccardOverlay').classList.add('open');
  // Stepping to the previous/next card: blink the content region over. The
  // popup shell (and its open flip) stays put — only header + body cross-fade.
  // .step-fade is guarded for reduced motion in site.css.
  if (_ccStepping) {
    [popup.querySelector('.ccard-header'), popup.querySelector('.ccard-body'), popup.querySelector('.ccard-life-script')].forEach(function (el) {
      if (!el) return;
      el.classList.remove('step-fade'); void el.offsetWidth; el.classList.add('step-fade');
    });
  }
}

function closeCompareCard() {
  const popup = document.querySelector('.ccard-popup');
  const overlay = document.getElementById('ccardOverlay');
  const finish = () => {
    popup.classList.remove('closing');
    overlay.classList.remove('open');
  };
  // Reduced motion: the flip-out is suppressed in CSS, so animationend would
  // never fire and the popup would hang open — close immediately instead.
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { finish(); return; }
  popup.classList.add('closing');
  let done = false;
  const fire = () => { if (done) return; done = true; finish(); };
  popup.addEventListener('animationend', fire, { once: true });
  setTimeout(fire, 320);   // belt-and-braces fallback (.2s flip-out + buffer)
}

// ── Spread grid with FLIP (shared, reusable) ─────────────────────────
// Builds a seat-based spread grid (crown row + 7 planetary rows + planet
// labels) into gridEl, holding 52 reusable card elements that move between
// fixed seats. ANY deck change — stepping ages in the Annual spread, or
// switching to the Spirit (deckAtAge 90) or Life (deckAtAge 1) master
// spreads — is a re-seat of the same elements, so it FLIP-animates.
//
// Returns a controller:
//   setDeck(deck, {animate})  re-place the 52 cards (animate defaults true;
//                             the first call never animates)
//   showRings(on)             toggle the fixed/semi gold rings (a .sl-rings
//                             class on the grid; used for Spirit/Life)
//   setPick(rank, suit)       highlight one card across all seats (the
//                             Birth Card Finder pick); pass null to clear
//   cardEl(idx) / getDeck()
//
// Fixed (same seat in Spirit and Life) and semi-fixed (two cards that trade
// seats) classes are baked onto the cards but only shown when rings are on.
// Clicking a card runs onCardClick (default: openCompareCard). Full per-card
// displacement detail lives in the compare popup; showGhosts(on) additionally
// reveals a ghost chip under each seat naming its Spirit owner — i.e. in Life
// mode, the card each occupant displaces (fixed seats get no chip).
function buildSpreadGrid(gridEl, opts) {
  opts = opts || {};
  const onCardClick = opts.onCardClick ||
    function (idx) { if (typeof openCompareCard === 'function') openCompareCard(idx); };

  const spir = deckAtAge(90);  // Spirit spread (perfect order)
  const life = deckAtAge(1);   // Life spread  (age 0)
  const displaces   = slDisplaces;
  const displacedBy = slDisplacedBy;

  function posLabel(pos) {
    if (pos >= 49) return `Crown · ${52 - pos}`;
    return `${SPREAD_PLANETS[Math.floor(pos / 7)]} · ${SPREAD_PLANETS[pos % 7]}`;
  }

  // Static seat cells: crown row + 7 planetary rows + planet-symbol labels.
  // The planet glyphs are plain labels — the planet readings live in the top
  // "Card Elements" row (#planetRow on the home page), not in this grid.
  let html = '';
  // The crown row's four leading/trailing spacer cells are repurposed on the
  // Cards of Life page (buildSpreadGrid runs once, from ensureSpreadCtl): two
  // host cells that each span two of the seven columns bookend the three crown
  // seats. #crownJoker (left) gets a static Joker card; #crownControls (right)
  // receives the relocated settings gear + age wheel. Both are filled/populated
  // by js/cardsoflife.js after the grid is built; empty here.
  html += '<div class="crown-row">';
  html += '<div class="crown-side crown-joker" id="crownJoker"></div>';
  for (let i = 51; i >= 49; i--) html += `<div class="sl-seat" data-pos="${i}"></div>`;
  html += '<div class="crown-side crown-controls" id="crownControls"></div>';
  html += '</div>';
  for (let row = 0; row < 7; row++)
    for (let col = 6; col >= 0; col--)
      html += `<div class="sl-seat" data-pos="${row * 7 + col}"></div>`;
  [6,5,4,3,2,1,0].forEach((col) => {
    const pname = SPREAD_PLANETS[col];
    html += `<div class="planet-col-label" data-planet="${pname}">${SPREAD_PLANET_SYM[pname]}</div>`;
  });
  gridEl.innerHTML = html;

  const seats = {};
  gridEl.querySelectorAll('.sl-seat').forEach((s) => { seats[+s.dataset.pos] = s; });

  // Ghost chips, two per seat (read against the LIFE occupant of the seat):
  //   .sl-ghost-d — the card the occupant DISPLACES (the seat's Spirit owner)
  //   .sl-ghost-b — the card the occupant is DISPLACED BY
  // Shown via the grid classes .sl-ghosts / .sl-ghosts-by (showGhosts).
  // Fixed seats (occupant is its own owner) keep invisible spacer chips so
  // every seat stays the same height when chips are visible.
  // The chips are recomputed for whatever deck is showing (paintGhosts), so the
  // displacements are right in every mode: Spirit shows none (every card is home),
  // Age / Life show that deck's displacement against the Spirit order.
  for (const pos in seats) {
    const row = document.createElement('div');   // both chips sit side by side under the card
    row.className = 'sl-ghost-row';
    ['sl-ghost-d', 'sl-ghost-b'].forEach((variant) => {
      const chip = document.createElement('span');
      chip.className = 'sl-ghost ' + variant;
      chip.dataset.verb = variant === 'sl-ghost-d' ? 'Displaces ' : 'Displaced by ';
      row.appendChild(chip);
    });
    seats[pos].appendChild(row);
  }
  function paintGhosts(deck) {
    for (const pos in seats) {
      const occupant = deck[pos];
      const dIdx = spir[pos];                      // Spirit owner of this seat (occupant displaces it)
      const bIdx = deck[spir.indexOf(occupant)];   // who now holds occupant's home seat (displaced it)
      const row  = seats[pos].querySelector('.sl-ghost-row');
      [[row.children[0], dIdx], [row.children[1], bIdx]].forEach(([chip, idx]) => {
        const oc = SPREAD_CARDS[idx];
        chip.className = 'sl-ghost ' + (chip.dataset.verb === 'Displaces ' ? 'sl-ghost-d' : 'sl-ghost-b')
          + ' ' + oc.suit + (idx === occupant ? ' sl-ghost-self' : '');
        chip.textContent = oc.rank + oc.sym;
        chip.title = chip.dataset.verb + oc.rank + oc.sym;
      });
    }
  }

  // One element per card, reused across every deck
  const cards = {};
  for (let idx = 0; idx < 52; idx++) {
    const c  = SPREAD_CARDS[idx];
    const el = document.createElement('div');
    el.className = 'spread-card ' + c.suit;
    el.dataset.idx = idx;
    el.innerHTML = spreadCardPips(c);
    if (spir.indexOf(idx) === life.indexOf(idx)) el.classList.add('sl-fixed');
    else if (displaces(idx) === displacedBy(idx)) el.classList.add('sl-semi');
    el.onclick = () => onCardClick(idx);
    cards[idx] = el;
  }

  let _deck = null;
  function place(deck, animate) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // FLIP only makes sense once cards already have a position
    const doAnim = animate && !reduce && _deck;
    const first  = {};
    if (doAnim) for (const k in cards) first[k] = cards[k].getBoundingClientRect();
    deck.forEach((cardIdx, pos) => {
      const seat = seats[pos], el = cards[cardIdx];
      if (el && seat) {
        if (el.parentNode !== seat) seat.appendChild(el);
        el.title = posLabel(pos);
      }
    });
    paintGhosts(deck);
    _deck = deck;
    if (!doAnim) return;
    // Invert to old position, then transition back to none
    for (const k in cards) {
      const el = cards[k], f = first[k];
      if (!f) continue;
      const l = el.getBoundingClientRect();
      const dx = f.left - l.left, dy = f.top - l.top;
      if (!dx && !dy) continue;
      el.style.transition = 'none';
      el.style.transform  = `translate(${dx}px, ${dy}px)`;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const k in cards) {
        const el = cards[k];
        if (!el.style.transform) continue;
        el.style.transition = 'transform .65s cubic-bezier(.22,1,.36,1)';
        el.style.transform  = '';
        el.addEventListener('transitionend', function te() {
          el.style.transition = '';
          el.removeEventListener('transitionend', te);
        });
      }
    }));
  }

  return {
    setDeck(deck, o) { o = o || {}; place(deck, o.animate !== false); },
    showRings(on) { gridEl.classList.toggle('sl-rings', !!on); },
    // mode: 'displaces' (or true, back-compat) | 'displaced' | 'both' | falsy = off
    showGhosts(mode) {
      if (mode === true) mode = 'displaces';
      const both = mode === 'both';
      gridEl.classList.toggle('sl-ghosts',    both || mode === 'displaces');
      gridEl.classList.toggle('sl-ghosts-by', both || mode === 'displaced');
    },
    setPick(rank, suit) {
      for (const k in cards) {
        const c = SPREAD_CARDS[k];
        cards[k].classList.toggle('finder-pick', !!(rank && c.rank === rank && c.suit === suit));
      }
    },
    // Highlight the picked card's seven Life Script cards (its planetary ruling
    // cards). Each gets .ls-pick + a --ls-i index in script order (Mercury→
    // Neptune), so the CSS glint ripples ON from the birth card. Highlights by
    // card identity, so it follows the cards wherever they sit in the current
    // deck; at the default age (the Life spread) the seven are the contiguous
    // seats just after the pick, so it reads as one wave. Pass null to clear.
    setScript(rank, suit) {
      for (const k in cards) {
        cards[k].classList.remove('ls-pick');
        cards[k].style.removeProperty('--ls-i');
      }
      // Drop any card-back overlays from a previous script (see the add loop).
      gridEl.querySelectorAll('.ls-back').forEach((b) => b.remove());
      if (!rank || suit === 'joker') return;
      const script = LIFE_SCRIPTS[`${rank}_${suit}`];
      if (!script) return;
      // Force a reflow between the clear and the re-add. Without this, any card
      // that appears in BOTH the prior and new life-script (the class was just
      // toggled off→on within one task) keeps its old animation phase + stale
      // --ls-i delay, so loading a new pick mid-riffle looked desynchronised.
      // The reflow makes the browser commit the cleared state first, so the
      // re-added .ls-pick restarts the lsRiffle keyframes from frame 0.
      void gridEl.offsetWidth;
      script.forEach((str, i) => {
        const cc = lsParseCard(str);
        const idx = SPREAD_CARDS.findIndex(c => c.rank === cc.rank && c.suit === cc.suit);
        if (idx >= 0 && cards[idx]) {
          cards[idx].classList.add('ls-pick');
          cards[idx].style.setProperty('--ls-i', i);
          // A real card back, overlaid at the seat level (NOT inside the card —
          // the card's overflow:hidden + container-type flatten 3D, so a child
          // back can't show a true backface). It runs the same riffle offset
          // 180deg (lsRiffleBack), so as the front card flips away (backface
          // hidden) this face turns to meet the viewer. Removed on the next
          // setScript. Only animates while the grid carries .ls-lifespread.
          const seat = cards[idx].parentNode;
          if (seat && !seat.querySelector('.ls-back')) {
            const back = document.createElement('div');
            back.className = 'ls-back card-back';
            back.setAttribute('aria-hidden', 'true');
            back.style.setProperty('--ls-i', i);
            back.innerHTML = '<span class="cb-coin"></span>';
            seat.appendChild(back);
          }
        }
      });
    },
    cardEl(idx) { return cards[idx]; },
    getDeck() { return _deck; }
  };
}

// ── Olney (1893) readings — the alternate "voice" for the Card Elements toggle
// on cardsoflife.html, paired with the modern SUIT_MEANINGS / NUMEROLOGY text
// above. Olney H. Richmond's own words from The Mystic Test Book (1893); each
// entry attaches as `.olney = {keywords, text, keynote}`. Sources + provenance:
// dev/Book of Life/olney-element-drafts.md.
(function () {
  var S = {
    hearts: {
      keywords: ['Love', 'Friendship', 'Affection', 'Spring'],
      keynote: 'The emblem of love, and of the first quarter and the first season.',
      text: 'The heart is an emblem of love the world over. In the springtime of life, the first quarter, love is the master passion; the heart was therefore chosen as the emblem of the first quarter and the first season. It is the suit of love, friendship, and affection, and of the desire for harmony, ruled by Venus, the planet of friendship and love, and by Mercury, which quickens it to passion.'
    },
    clubs: {
      keywords: ['Knowledge', 'Intelligence', 'Summer'],
      keynote: 'The emblem of knowledge, and of the summer of life.',
      text: 'The club, the trefoil or clover leaf, is the emblem of summer and the second period of life, for knowledge is best gained and retained in the summer of life. It became the emblem of knowledge and intelligence, ruled by the Earth and by Mars. Under the gentler influence it signifies learning and argument; under the stronger it turns to heat, to quarrels, and even to law suits.'
    },
    diamonds: {
      keywords: ['Wealth', 'Property', 'Commerce', 'Autumn'],
      keynote: 'The emblem of wealth, and of the harvest season.',
      text: 'The third season, autumn, has for its emblem the diamond, the emblem of wealth. The third period of man’s life is the one in which he is best able to gain wealth, for in the fall of the year the crops are sold and the wealth of the harvest realized. It is the suit of money, property, and commerce, ruled by Jupiter, the giver of wealth, and by Neptune, whose diamonds indicate commerce.'
    },
    spades: {
      keywords: ['Labour', 'Death', 'Winter'],
      keynote: 'The emblem of labour and death combined, the winter quarter.',
      text: 'Winter, the fourth quarter, is represented by the spade, which was once the acorn, the old emblem of the death and burial of the physical form. Yet the acorn planted in the soil sends forth a new tree in time, so it carried a deeper meaning than the spade, which alone would symbolize death without resurrection. Being also an instrument of labour, the spade becomes the emblem of labour and death combined, ruled by Saturn from the standpoint of death, and by Uranus from the point of labour.'
    }
  };
  var N = {
    'A':  { keywords: ['A Single Thing', 'A Wish', 'A Beginning'], keynote: 'A single thing, a wish or a letter, and the start of a quarter.', text: 'The ace is the single spot, and stands for a single thing. It begins its quarter, as the ace of hearts begins the quarter of love, a heart single to the labour of love; in a reading it commonly falls as a wish or a letter.' },
    '2':  { keywords: ['Union', 'Bargain', 'Co-partnership'], keynote: 'Union and joining, a bargain between two, letters passing.', text: 'The twos indicate unions or joinings, and bargains between two persons; co-partnership, and letters passing from person to person.' },
    '3':  { keywords: ['Indecision', 'Two Ways Open'], keynote: 'Indecision, a place where two ways open before one.', text: 'The threes indicate indecision, a place where two ways open before one, as if the spot in the centre were the person and the others the two roads leading off in different directions.' },
    '4':  { keywords: ['Satisfaction', 'Stability'], keynote: 'Satisfaction and stability, a thing standing firm.', text: 'The four is the squared number, and signifies satisfaction and stability, as the four of spades gives a satisfaction in labour.' },
    '5':  { keywords: ['Change', 'A Journey'], keynote: 'Change, a cross in the path, a journey out of the old routine.', text: 'The five shows a change, for it represents a cross, an X, in one’s path; the lines of the life change, and a journey perhaps removes the person from the monotony that went before.' },
    '6':  { keywords: ['Monotony', 'Routine'], keynote: 'A life moving in straight lines, the settled routine.', text: 'The sixes show a life, for a time, moving in straight lines, with nothing out of the usual routine, until at length an obstacle comes in the way, and trouble with it.' },
    '7':  { keywords: ['The Soul', 'Trouble'], keynote: 'The soul’s number, a trouble met from one way only.', text: 'The number seven represents the soul in nature, and stands at the centre of all the symbolic numbers. As an emblem it is a trouble, but a trouble from one way only; approach it from another direction and the trouble disappears. It is a sacred number representing spirit, yet its trouble is material and not spiritual, for the spiritual and the material are antipodes of each other.' },
    '8':  { keywords: ['Power', 'Gatherings'], keynote: 'Power to overcome obstacles, and the gathering of many.', text: 'The eights indicate power to overcome obstacles, and spiritual advancement, and numbers of persons, congregations or gatherings of people; the row is a symmetrical fullness, a rounding out.' },
    '9':  { keywords: ['Disappointment', 'The Obstacle'], keynote: 'A disappointing obstacle in the centre that bars the way.', text: 'The geometrical form of the nines is a path with a disappointing obstacle in the centre. Approach it from either end and it bars your progress; you are disappointed and turned back. The nines rule under Saturn, the planet of disappointment.' },
    '10': { keywords: ['Success', 'The Open Space'], keynote: 'Success on every side, standing in the open space.', text: 'The tens represent success, as if one stood in the open space between the spots, surrounded with success upon all sides. The tens rule under Uranus, the planet of success.' },
    'J':  { keywords: ['The Young Man', 'A Male Friend'], keynote: 'A young man and a male friend, counting eleven.', text: 'The knave, counting eleven, is emblematic of the younger and unmarried portion of the male persuasion, a young man or a male friend, and in a reading a man you may trust. They were honest men all in the beginning, and only later, standing next the royal couple, were some transformed by bribery into knaves.' },
    'Q':  { keywords: ['The Woman', 'Love', 'Virtue'], keynote: 'The woman, ruling under Venus, holding the lotus of virtue.', text: 'The queen, counting twelve, is the woman or lady, ruling under Venus, the female planet and ruler of love. She looks from the same Egyptian eyes as of old, and holds modestly the secret lotus flower of innocence and virtue.' },
    'K':  { keywords: ['Power', 'Rule'], keynote: 'The man of power and rule, ruling under Jupiter.', text: 'The king, counting thirteen, is the man of power and rule, ruling under Jupiter, which denotes power and rule; he holds up the sword of justice or the battle axe of power, as the kings have done through all the ages.' }
  };
  var SM = window.SUIT_MEANINGS || {}, NU = window.NUMEROLOGY || {};
  Object.keys(S).forEach(function (k) { if (SM[k]) SM[k].olney = S[k]; });
  Object.keys(N).forEach(function (k) { if (NU[k]) NU[k].olney = N[k]; });
})();
