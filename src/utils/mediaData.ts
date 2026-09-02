import { YouTubeTrack, SpotifyTrack, EqualizerPreset } from '../types';

export const EQUALIZER_PRESETS: Record<
  EqualizerPreset,
  { name: string; label: string; desc: string; bass: number; mid: number; treble: number; color: string }
> = {
  flat: {
    name: 'flat',
    label: 'Studio Flat',
    desc: 'Pure, transparent acoustic response without coloration',
    bass: 0,
    mid: 0,
    treble: 0,
    color: '#38bdf8',
  },
  'bass-boost': {
    name: 'bass-boost',
    label: 'Deep Bass Boost',
    desc: 'Punchy low-end sub-bass for club, EDM, and hip-hop',
    bass: 8,
    mid: -1,
    treble: 3,
    color: '#ec4899',
  },
  vocal: {
    name: 'vocal',
    label: 'Vocal Clarity',
    desc: 'Elevated midrange & crisp highs for pristine lyrics & voice',
    bass: -2,
    mid: 6,
    treble: 4,
    color: '#10b981',
  },
  lofi: {
    name: 'lofi',
    label: 'Lo-Fi Warmth',
    desc: 'Warm analog tape saturation with softened highs for study & chill',
    bass: 4,
    mid: 3,
    treble: -4,
    color: '#f59e0b',
  },
  live: {
    name: 'live',
    label: 'Live Concert Stage',
    desc: 'Spacious 3D stereo widening & energetic presence',
    bass: 5,
    mid: 2,
    treble: 6,
    color: '#8b5cf6',
  },
};

export const MUSIC_GENRES = [
  { id: 'all', label: 'All Songs', icon: 'Sparkles' },
  { id: 'trending', label: 'Trending Hits', icon: 'Flame' },
  { id: 'bollywood', label: 'Bollywood & Hindi', icon: 'Music2' },
  { id: 'punjabi', label: 'Punjabi & Desi', icon: 'Radio' },
  { id: 'south-indian', label: 'South Indian Hits', icon: 'Music' },
  { id: 'pop', label: 'Global Pop', icon: 'Disc3' },
  { id: 'edm', label: 'EDM & Dance', icon: 'Zap' },
  { id: 'hiphop', label: 'Hip-Hop & Rap', icon: 'Headphones' },
  { id: 'rock', label: 'Rock & Legends', icon: 'Volume2' },
  { id: 'lofi', label: 'Lo-Fi & Synthwave', icon: 'Coffee' },
  { id: 'classical', label: 'Classical & OST', icon: 'Sliders' },
  { id: 'focus', label: 'Focus & Study', icon: 'Brain' },
  { id: 'devotional', label: 'Devotional & Zen', icon: 'Heart' },
  { id: 'workout', label: 'Gym & Cardio', icon: 'Activity' },
];

export const POPULAR_YOUTUBE_TRACKS: YouTubeTrack[] = [
  // -------------------------------------------------------------
  // BOLLYWOOD & HINDI SUPERHITS
  // -------------------------------------------------------------
  {
    id: 'yt-b1',
    videoId: 'BBAyRBTfsOU',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam, Amitabh Bhattacharya',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '4:28',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/BBAyRBTfsOU?autoplay=1&enablejsapi=1',
    lyrics: [
      'Mujhko itna bataye koi, kaise tujhse dil na lagaye koi...',
      'Rabba ne tujhko banane mein, kardi hai husn ki khaali tijoriyan',
      'Kajal ki siyahi se likhi, hai tune jaane kitno ki love storiyan...',
      'Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun',
      'Din beete saara teri fikr mein, rain saari teri khair manaun!',
      'Patjhad ke mausam mein bhi, rang gulaabi hota hai',
      'Raina bita ke jab tu mujhse milti hai...',
    ],
  },
  {
    id: 'yt-b2',
    videoId: 'DULrvDVqyXI',
    title: 'Naam Hai Tera Tera',
    artist: 'Himesh Reshammiya ft. Deepika Padukone',
    thumbnail: 'https://img.youtube.com/vi/DULrvDVqyXI/hqdefault.jpg',
    duration: '4:47',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/DULrvDVqyXI?autoplay=1&enablejsapi=1',
    lyrics: [
      'Dil ki surkhiyon mein hai tera naam...',
      'Naam hai tera tera, naam hai tera tera!',
      'Ooo ho oo, naam hai tera tera, naam hai tera...',
      'Aap kaa surroor, meri jaan hai tu...',
      'Har taraf teri aashiqui ka jaadu chha gaya!',
      'Maine socha na tha dil aise machal jaayega,',
      'Tere nakhre pe yeh aashiq pighal jaayega!',
      'Naam hai tera tera, naam hai tera tera!',
    ],
  },
  {
    id: 'yt-b3',
    videoId: 'IJq0ydcCQup',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh, Mithoon',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '4:22',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/IJq0ydcCQup?autoplay=1&enablejsapi=1',
    lyrics: [
      'Hum tere bin ab reh nahi sakte, tere bina kya wajood mera?',
      'Tujhse juda agar ho jaayenge, toh khud se hi ho jaayenge juda...',
      'Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho!',
      'Chain bhi, mera dard bhi, meri aashiqui ab tum hi ho...',
      'Tera mera rishta hai kaisa, ek pal door gawaara nahi',
      'Tere liye har roz hain jeete, tujhko diya mera waqt sabhi!',
    ],
  },
  {
    id: 'yt-b4',
    videoId: 'bzSTpdcs-EI',
    title: 'Channa Mereya',
    artist: 'Arijit Singh, Pritam',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '4:49',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/bzSTpdcs-EI?autoplay=1&enablejsapi=1',
    lyrics: [
      'Achha chalta hoon, duaon mein yaad rakhna...',
      'Mere zikr ka zubaan pe swaad rakhna!',
      'Dil ke sandookon mein mere achhe kaam rakhna,',
      'Chitthi-taaron mein bhi mera tu salaam rakhna...',
      'Andhera tera maine le liya, mera ujla sitaara tere naam kiya!',
      'Channa mereya mereya, channa mereya mereya...',
    ],
  },
  {
    id: 'yt-b5',
    videoId: 'ElZfdU54Cp8',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    duration: '4:21',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/ElZfdU54Cp8?autoplay=1&enablejsapi=1',
    lyrics: [
      'Tu mera koi na hoke bhi kuch laage...',
      'Kiya re jo bhi tune kaise kiya re, jiya ko mere baandh aise liya re',
      'Apna bana le piya, apna bana le piya...',
      'Dil ke nagar mein sheher tu basa le piya!',
      'Chhooke mujhe tu guzar jaata hai jahan, khushboo wahan se bikharti hai...',
    ],
  },
  {
    id: 'yt-b6',
    videoId: 'gvyUuxdRdR4',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur, Tanishk Bagchi',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '3:50',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/gvyUuxdRdR4?autoplay=1&enablejsapi=1',
    lyrics: [
      'Teri meri gallan ho gayi mashhoor, kar na kabhi tu mujhe nazron se door...',
      'Kithe chaliye tu kithe chaliye, jaan leke meri kithe chaliye?',
      'Kaatun kaise raataan, o saawre? Jiya nahi jaata, sun bawre...',
      'Ke raataan lambiyan lambiyan re, kate tere sangeyan sangeyan re!',
      'Cham cham barsa barsaatan da, din beete saara tere yaadanda...',
    ],
  },
  {
    id: 'yt-b7',
    videoId: 'kJ5F50SskgY',
    title: 'Deewana Main Chala & 90s Golden Romances',
    artist: 'Kumar Sanu, Alka Yagnik, Udit Narayan',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    duration: '4:30',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/kJ5F50SskgY?autoplay=1&enablejsapi=1',
    lyrics: [
      'Deewana main chala, use dhoondhne jahan mein...',
      'Kahin toh milegi meri chaahaton ki manzil',
      'Dheere dheere se meri zindagi mein aana,',
      'Dheere dheere se dil ko churaana...',
      'Tumse pyaar humein hai kitna jaane jaana,',
      'Khud kabhi keh nahi paaye!',
    ],
  },
  {
    id: 'yt-b8',
    videoId: '0oONB8u1c6I',
    title: 'Kal Ho Naa Ho (Title Track)',
    artist: 'Sonu Nigam, Shankar-Ehsaan-Loy',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '5:21',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/0oONB8u1c6I?autoplay=1&enablejsapi=1',
    lyrics: [
      'Har ghadi badal rahi hai roop zindagi...',
      'Chhaanv hai kabhi kabhi hai dhoop zindagi',
      'Har pal yahan jee bhar jiyo, jo hai samaan kal ho naa ho!',
      'Palkon ke leke saaye, paas koi jo aaye',
      'Lakh sambhalo paagal dil ko, dil dhadke hi jaaye...',
    ],
  },
  {
    id: 'yt-b9',
    videoId: 'c_KzZkIks9k',
    title: 'Kun Faya Kun - Rockstar',
    artist: 'A.R. Rahman, Mohit Chauhan, Javed Ali',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '7:52',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/c_KzZkIks9k?autoplay=1&enablejsapi=1',
    lyrics: [
      'Ya Nizamuddin Auliya, Ya Nizamuddin Sarkar...',
      'Kun faya kun, kun faya kun, faya kun, faya kun, faya kun...',
      'Jab kahin pe kuch nahi bhi nahi tha, wahi tha wahi tha wahi tha...',
      'Sajra savera mere tan barse, kajra andhera teri jalti lau...',
      'Rang reza rang reza rang reza...',
    ],
  },
  {
    id: 'yt-b10',
    videoId: 'sAzlW4DY3p4',
    title: 'Agar Tum Saath Ho - Tamasha',
    artist: 'Alka Yagnik, Arijit Singh, A.R. Rahman',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '5:41',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/sAzlW4DY3p4?autoplay=1&enablejsapi=1',
    lyrics: [
      'Pal bhar theher jaao, dil yeh sambhal jaaye...',
      'Kaise tumhe roka karoon, meri taraf aata har gham phisal jaaye',
      'Aankhon mein aansu leke hothon se muskuraaye...',
      'Agar tum saath ho, har dard ko main muskura ke seh loon!',
      'Dil yeh sambhalta nahi tere bina...',
    ],
  },
  {
    id: 'yt-b11',
    videoId: 'Yw63tY6cO_A',
    title: 'Pehle Bhi Main - Animal',
    artist: 'Vishal Mishra, Raj Shekhar',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '4:10',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/Yw63tY6cO_A?autoplay=1&enablejsapi=1',
    lyrics: [
      'Pehle bhi main tumse mila hoon, pehli dafa hi milke laga...',
      'Tune chhua zakhmon ko mere, marham sa har jagah laga',
      'Kyun khwaab dikhaate ho tum mujhe aise...',
      'Dil toot na jaaye kisi din!',
    ],
  },
  {
    id: 'yt-b12',
    videoId: 'qLpDsmr0u_g',
    title: 'Satranga - Animal',
    artist: 'Arijit Singh, Shreyas Puranik',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '4:31',
    category: 'bollywood',
    embedUrl: 'https://www.youtube.com/embed/qLpDsmr0u_g?autoplay=1&enablejsapi=1',
    lyrics: [
      'Aadha tera ishq aadha mera, aadhi aadhi baatein karke poora hua...',
      'Satranga mera ishq yeh, rangeeniyon se bhar gaya!',
      'Tere bina soona sa sansaar tha...',
    ],
  },

  // -------------------------------------------------------------
  // PUNJABI & DESI BLOCKBUSTERS
  // -------------------------------------------------------------
  {
    id: 'yt-p1',
    videoId: 'mH_LFkWxpI0',
    title: 'Lover',
    artist: 'Diljit Dosanjh, Intense',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '3:12',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/mH_LFkWxpI0?autoplay=1&enablejsapi=1',
    lyrics: [
      'Tera ni mai lover, saare kehn de mai kamla...',
      'Tenu dil ditta, tu sambhle ya tod de!',
      'Gaddi ch chaldi beat meri, dil tere utte fit meri',
      'Ni jivein koi nasha chadheya, tere naina cho ishq tareya...',
      'Lover, lover, lover...',
    ],
  },
  {
    id: 'yt-p2',
    videoId: 'cl0a3i2wFJA',
    title: 'GOAT',
    artist: 'Diljit Dosanjh',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    duration: '3:44',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/cl0a3i2wFJA?autoplay=1&enablejsapi=1',
    lyrics: [
      'Gabru te maari tere nakhre ne look ni...',
      'G.O.A.T. da khitaab jatt kol!',
      'Ho turda jado vi painda rola har thaa...',
      'Diamond di ring wargi ae naar ni!',
    ],
  },
  {
    id: 'yt-p3',
    videoId: 'VNs_cCtdbPc',
    title: 'Brown Munde',
    artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '4:27',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/VNs_cCtdbPc?autoplay=1&enablejsapi=1',
    lyrics: [
      'Desi jehe geet aa trap jehi beat aa...',
      'Sir kadh gajde speaker\'an ch wajde, brown munde!',
      'Geetkaari chhad diti kithon tak pauhch...',
      'Asi aunde jithe hunda khadka!',
    ],
  },
  {
    id: 'yt-p4',
    videoId: 'vX2cDW8LUWk',
    title: 'Excuses',
    artist: 'AP Dhillon, Gurinder Gill, Intense',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '2:56',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/vX2cDW8LUWk?autoplay=1&enablejsapi=1',
    lyrics: [
      'Kehndi hundi si chan tak raah bana de...',
      'Taare ne pasand mainu hethaan saare laa de',
      'Munde pagal ho gaye ne tere piche...',
      'Dil todna si taan pehla hi das dindi!',
    ],
  },
  {
    id: 'yt-p5',
    videoId: '4dfVp_mDkEw',
    title: 'Tauba Tauba',
    artist: 'Karan Aujla (Bad Newz)',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '3:27',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/4dfVp_mDkEw?autoplay=1&enablejsapi=1',
    lyrics: [
      'Husn tera tauba tauba, nakhra tera tauba tauba...',
      'Munde saare karde ne wait teri ik jhalak di!',
      'Tauba tauba!',
    ],
  },
  {
    id: 'yt-p6',
    videoId: '5Dk_fKzXl4s',
    title: 'Pasoori',
    artist: 'Ali Sethi, Shae Gill (Coke Studio)',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '4:36',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/5Dk_fKzXl4s?autoplay=1&enablejsapi=1',
    lyrics: [
      'Agg laawan majboori nu, aan jaan di pasoori nu...',
      'Zehar bane haan teri, pee jaavan main poori nu!',
      'Aana si o nai aaya, dil baang baang mera takraya...',
      'Chale to katan na yeh raste lambe!',
    ],
  },
  {
    id: 'yt-p7',
    videoId: 'n_FCrCQ6-bI',
    title: '295',
    artist: 'Sidhu Moose Wala',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '4:30',
    category: 'punjabi',
    embedUrl: 'https://www.youtube.com/embed/n_FCrCQ6-bI?autoplay=1&enablejsapi=1',
    lyrics: [
      'Dass de tu kedi gall di saza ditti ae...',
      'Geetan ch sach bolna gunah ho gaya!',
      '295 da daa laggeya yaaran utte...',
    ],
  },

  // -------------------------------------------------------------
  // SOUTH INDIAN (TELUGU / TAMIL) BLOCKBUSTERS
  // -------------------------------------------------------------
  {
    id: 'yt-s1',
    videoId: 'OsU0CGZoV8E',
    title: 'Naatu Naatu (Oscar Winner) - RRR',
    artist: 'M.M. Keeravaani, Rahul Sipligunj, Kaala Bhairava',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '4:35',
    category: 'south-indian',
    embedUrl: 'https://www.youtube.com/embed/OsU0CGZoV8E?autoplay=1&enablejsapi=1',
    lyrics: [
      'Naatu Naatu Naatu Naatu Naatu Naatu Veera Naatu...',
      'Gundela lothullo unna dhummu thudichi lechuko!',
      'Dhammunte aadaali naatu kuthu kottali...',
      'Erra jenda pai etti katti parigethu!',
    ],
  },
  {
    id: 'yt-s2',
    videoId: '8FAUEv_E_xQ',
    title: 'Arabic Kuthu (Halamithi Habibo) - Beast',
    artist: 'Anirudh Ravichander, Jonita Gandhi',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '4:40',
    category: 'south-indian',
    embedUrl: 'https://www.youtube.com/embed/8FAUEv_E_xQ?autoplay=1&enablejsapi=1',
    lyrics: [
      'Halamithi Habibo, halamithi habibo...',
      'Malama pitha pithadhe, malama pitha pithadhe!',
      'Thala mudi katti vacha, nenjukulla jodi aacha...',
      'Arabic kuthu dance adu macha!',
    ],
  },
  {
    id: 'yt-s3',
    videoId: 'hcMzwMrr1tE',
    title: 'Oo Antava Oo Oo Antava - Pushpa',
    artist: 'Devi Sri Prasad, Indravathi Chauhan',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '3:48',
    category: 'south-indian',
    embedUrl: 'https://www.youtube.com/embed/hcMzwMrr1tE?autoplay=1&enablejsapi=1',
    lyrics: [
      'Koka koka katti choosthe oo antava mawa...',
      'Oo antava mawa, oo oo antava!',
      'Mee mogollu andharu okate raasi...',
    ],
  },
  {
    id: 'yt-s4',
    videoId: 'eYq7WapuDLU',
    title: 'Enjoy Enjaami',
    artist: 'Dhee ft. Arivu, Santhosh Narayanan',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '5:00',
    category: 'south-indian',
    embedUrl: 'https://www.youtube.com/embed/eYq7WapuDLU?autoplay=1&enablejsapi=1',
    lyrics: [
      'Cuckoo cuckoo thaatha thaatha kala vettu...',
      'Enjoy enjaami vaango vaango onnagi!',
      'Amma paadum pattu kaetka thoongalaamaa?',
    ],
  },

  // -------------------------------------------------------------
  // GLOBAL POP & BILLBOARD HITS
  // -------------------------------------------------------------
  {
    id: 'yt-g1',
    videoId: '4NRXx6U8ABQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '3:20',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/4NRXx6U8ABQ?autoplay=1&enablejsapi=1',
    lyrics: [
      'Yeah... I\'ve been tryna call, I\'ve been on my own for long enough',
      'Maybe you can show me how to love, maybe',
      'I\'m going through withdrawals, you don\'t even have to do too much',
      'I said, ooh, I\'m blinded by the lights',
      'No, I can\'t sleep until I feel your touch!',
    ],
  },
  {
    id: 'yt-g2',
    videoId: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '3:53',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8?autoplay=1&enablejsapi=1',
    lyrics: [
      'The club isn\'t the best place to find a lover so the bar is where I go',
      'Come on now, follow my lead, I may be crazy, don\'t mind me',
      'I\'m in love with the shape of you, we push and pull like a magnet do',
      'Although my heart is falling too, I\'m in love with your body!',
    ],
  },
  {
    id: 'yt-g3',
    videoId: '3YxaaGgTQYM',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    duration: '3:50',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/3YxaaGgTQYM?autoplay=1&enablejsapi=1',
    lyrics: [
      'I\'m tryna put you in the worst mood, ah',
      'P1 cleaner than your church shoes, ah',
      'Look what you\'ve done, I\'m a motherfuckin\' starboy!',
      'Every day a star is born, clap if you feel it...',
    ],
  },
  {
    id: 'yt-g4',
    videoId: 'H5v3kku4y6Q',
    title: 'As It Was',
    artist: 'Harry Styles',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '2:47',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/H5v3kku4y6Q?autoplay=1&enablejsapi=1',
    lyrics: [
      'Hold on, as it was, you know it\'s not the same as it was',
      'In this world, it\'s just us, you know it\'s not the same as it was...',
      'Answer the phone, Harry, you\'re no good alone!',
    ],
  },
  {
    id: 'yt-g5',
    videoId: 'G7KNmW9a75Y',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '3:20',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/G7KNmW9a75Y?autoplay=1&enablejsapi=1',
    lyrics: [
      'I can buy myself flowers, write my name in the sand',
      'Talk to myself for hours, say things you don\'t understand',
      'I can take myself dancing, and I can hold my own hand',
      'Yeah, I can love me better than you can!',
    ],
  },
  {
    id: 'yt-g6',
    videoId: 'ic8j13piAhQ',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '2:58',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/ic8j13piAhQ?autoplay=1&enablejsapi=1',
    lyrics: [
      'Fever dream high in the quiet of the night',
      'You know that I caught it (oh yeah, you\'re right, I want it)',
      'And it\'s new, the shape of your body, it\'s blue, the feeling I\'ve got',
      'And it\'s ooh, whoa oh, it\'s a cruel summer with you!',
    ],
  },
  {
    id: 'yt-g7',
    videoId: 'eVTXPUF4Oz4',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '2:55',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/eVTXPUF4Oz4?autoplay=1&enablejsapi=1',
    lyrics: [
      'Now he\'s thinkin\' \'bout me every night, oh',
      'Is it that sweet? I guess so!',
      'Say you can\'t sleep, baby, I know, that\'s that me espresso!',
    ],
  },
  {
    id: 'yt-g8',
    videoId: 'TUVcZfQe-Kw',
    title: 'Levitating',
    artist: 'Dua Lipa ft. DaBaby',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '3:23',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/TUVcZfQe-Kw?autoplay=1&enablejsapi=1',
    lyrics: [
      'If you wanna run away with me, I know a galaxy',
      'And I can take you for a ride',
      'I had a premonition that we fell into a rhythm',
      'Where the music don\'t stop for life...',
      'You want me, I want you, baby, my sugarboo, I\'m levitating!',
    ],
  },
  {
    id: 'yt-g9',
    videoId: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '5:59',
    category: 'rock',
    embedUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1&enablejsapi=1',
    lyrics: [
      'Is this the real life? Is this just fantasy?',
      'Caught in a landslide, no escape from reality.',
      'Open your eyes, look up to the skies and see...',
      'Mama, ooh, didn\'t mean to make you cry,',
      'If I\'m not back again this time tomorrow, carry on, carry on...',
    ],
  },
  {
    id: 'yt-g10',
    videoId: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '4:41',
    category: 'trending',
    embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&enablejsapi=1',
    lyrics: [
      'Ay, Fonsi, D.Y., oh oh...',
      'Sí, sabes que ya llevo un rato mirándote, tengo que bailar contigo hoy',
      'Tú, tú eres el imán y yo soy el metal, me voy acercando y voy armando el plan',
      'Despacito, quiero respirar tu cuello despacito...',
    ],
  },
  {
    id: 'yt-g11',
    videoId: 'YykjpeuMNEk',
    title: 'Hymn for the Weekend',
    artist: 'Coldplay ft. Beyoncé',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '4:20',
    category: 'pop',
    embedUrl: 'https://www.youtube.com/embed/YykjpeuMNEk?autoplay=1&enablejsapi=1',
    lyrics: [
      'Oh, angel sent from up above, you know you make my world light up',
      'Life is a drink and love\'s a drug, oh now I think I must be miles up',
      'So drink from me, drink from me, when I was so thirsty...',
      'Pour on a symphony, now I just can\'t get enough!',
    ],
  },

  // -------------------------------------------------------------
  // EDM & CLUB ANTHEMS
  // -------------------------------------------------------------
  {
    id: 'yt-e1',
    videoId: '60ItHLz5WEA',
    title: 'Faded',
    artist: 'Alan Walker',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '3:32',
    category: 'edm',
    embedUrl: 'https://www.youtube.com/embed/60ItHLz5WEA?autoplay=1&enablejsapi=1',
    lyrics: [
      'You were the shadow to my light, did you feel us?',
      'Another start, you fade away, afraid our aim is out of sight',
      'Where are you now? Was it all in my fantasy?',
      'I\'m faded, I\'m faded, so lost, I\'m faded...',
    ],
  },
  {
    id: 'yt-e2',
    videoId: '_ovdm2yX4MA',
    title: 'Levels',
    artist: 'Avicii',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '3:20',
    category: 'edm',
    embedUrl: 'https://www.youtube.com/embed/_ovdm2yX4MA?autoplay=1&enablejsapi=1',
    lyrics: [
      'Oh, sometimes I get a good feeling, yeah',
      'Get a feeling that I never, never, never, never had before, no no',
      'I get a good feeling, yeah!',
    ],
  },
  {
    id: 'yt-e3',
    videoId: 'PT2_F-1esPk',
    title: 'Closer',
    artist: 'The Chainsmokers ft. Halsey',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '4:05',
    category: 'edm',
    embedUrl: 'https://www.youtube.com/embed/PT2_F-1esPk?autoplay=1&enablejsapi=1',
    lyrics: [
      'So, baby, pull me closer in the back seat of your Rover',
      'That I know you can\'t afford, bite that tattoo on your shoulder',
      'Pull the sheets right off the corner of the mattress that you stole',
      'From your roommate back in Boulder, we ain\'t ever getting older...',
    ],
  },
  {
    id: 'yt-e4',
    videoId: 'IcrbM1l_BoI',
    title: 'Wake Me Up',
    artist: 'Avicii ft. Aloe Blacc',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '4:09',
    category: 'edm',
    embedUrl: 'https://www.youtube.com/embed/IcrbM1l_BoI?autoplay=1&enablejsapi=1',
    lyrics: [
      'Feeling my way through the darkness, guided by a beating heart',
      'I can\'t tell where the journey will end, but I know where to start',
      'So wake me up when it\'s all over, when I\'m wiser and I\'m older',
      'All this time I was finding myself, and I didn\'t know I was lost...',
    ],
  },
  {
    id: 'yt-e5',
    videoId: 'gCYcHz256bo',
    title: 'Animals',
    artist: 'Martin Garrix',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '3:12',
    category: 'edm',
    embedUrl: 'https://www.youtube.com/embed/gCYcHz256bo?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Big Room Dutch House Drop & Sub Kick] ♪',
      '♪ [High Energy Festival Synth Lead] ♪',
      'We\'re the fucking animals!',
    ],
  },

  // -------------------------------------------------------------
  // HIP-HOP & RAP
  // -------------------------------------------------------------
  {
    id: 'yt-h1',
    videoId: '_Yhyp-_hX2s',
    title: 'Lose Yourself',
    artist: 'Eminem',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: '5:26',
    category: 'hiphop',
    embedUrl: 'https://www.youtube.com/embed/_Yhyp-_hX2s?autoplay=1&enablejsapi=1',
    lyrics: [
      'Look, if you had one shot, or one opportunity',
      'To seize everything you ever wanted in one moment',
      'Would you capture it, or just let it slip?',
      'His palms are sweaty, knees weak, arms are heavy',
      'There\'s vomit on his sweater already, mom\'s spaghetti...',
      'You better lose yourself in the music, the moment, you own it!',
    ],
  },
  {
    id: 'yt-h2',
    videoId: 'tvTRZJ-4EyI',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    duration: '2:57',
    category: 'hiphop',
    embedUrl: 'https://www.youtube.com/embed/tvTRZJ-4EyI?autoplay=1&enablejsapi=1',
    lyrics: [
      'Nobody pray for me, it been that day for me',
      'Bitch, sit down, be humble! (Hol\' up, hol\' up, sit down, be humble)',
      'My left stroke just went viral, right stroke put lil\' baby in a spiral!',
    ],
  },
  {
    id: 'yt-h3',
    videoId: 'xpVfcZ0ZcFM',
    title: 'God\'s Plan',
    artist: 'Drake',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    duration: '3:19',
    category: 'hiphop',
    embedUrl: 'https://www.youtube.com/embed/xpVfcZ0ZcFM?autoplay=1&enablejsapi=1',
    lyrics: [
      'I hold back, sometimes I won\'t, yeah',
      'I feel good, sometimes I don\'t, ayy, don\'t',
      'God\'s plan, God\'s plan, I hold on, I\'m on a roll...',
    ],
  },

  // -------------------------------------------------------------
  // ROCK & LEGENDS
  // -------------------------------------------------------------
  {
    id: 'yt-r1',
    videoId: 'kXYiU_JCYtU',
    title: 'Numb',
    artist: 'Linkin Park',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: '3:07',
    category: 'rock',
    embedUrl: 'https://www.youtube.com/embed/kXYiU_JCYtU?autoplay=1&enablejsapi=1',
    lyrics: [
      'I\'m tired of being what you want me to be',
      'Feeling so faithless, lost under the surface',
      'I\'ve become so numb, I can\'t feel you there',
      'Become so tired, so much more aware...',
      'I\'m becoming this, all I want to do is be more like me and be less like you!',
    ],
  },
  {
    id: 'yt-r2',
    videoId: 'eVTXPUF4Oz5',
    title: 'In the End',
    artist: 'Linkin Park',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '3:36',
    category: 'rock',
    embedUrl: 'https://www.youtube.com/embed/1yw1Tgj9-VU?autoplay=1&enablejsapi=1',
    lyrics: [
      'It starts with one thing, I don\'t know why, it doesn\'t even matter how hard you try',
      'Keep that in mind, I designed this rhyme to explain in due time',
      'I tried so hard and got so far, but in the end it doesn\'t even matter!',
    ],
  },
  {
    id: 'yt-r3',
    videoId: '7wtfhZwyrcc',
    title: 'Believer',
    artist: 'Imagine Dragons',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '3:24',
    category: 'rock',
    embedUrl: 'https://www.youtube.com/embed/7wtfhZwyrcc?autoplay=1&enablejsapi=1',
    lyrics: [
      'First things first, I\'ma say all the words inside my head',
      'I\'m fired up and tired of the way that things have been, oh-ooh',
      'Pain! You made me a, you made me a believer, believer!',
    ],
  },

  // -------------------------------------------------------------
  // LO-FI, SYNTHWAVE & CHILL BEATS
  // -------------------------------------------------------------
  {
    id: 'yt-l1',
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study To',
    artist: 'Lofi Girl',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: 'Live Stream',
    category: 'lofi',
    embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Chill Lo-Fi Melodic Piano & Vinyl Crackle] ♪',
      '♪ [Soft Rhodes Chords & Subtle Rainy Beats] ♪',
      '♪ [Deep Sub-Bass Pulsing in Harmony] ♪',
      '♪ [Binaural Alpha Waves Flowing in 432Hz] ♪',
      '♪ [Pure Focus & Serene Ambient Atmosphere] ♪',
    ],
  },
  {
    id: 'yt-l2',
    videoId: '4xDzrJKXOOY',
    title: 'Synthwave Radio - Chill synth / Retro beats',
    artist: 'Lofi Girl Synthwave',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: 'Live Stream',
    category: 'lofi',
    embedUrl: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Retro 80s Neon Synthesizers & Arpeggiators] ♪',
      '♪ [Warm Analog Basslines & Cyberpunk Groove] ♪',
      '♪ [Vibrant Night Drive Echoes & Shimmering Leads] ♪',
      '♪ [Hypnotic Electro Retrowave Rhythm] ♪',
    ],
  },
  {
    id: 'yt-l3',
    videoId: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill To',
    artist: 'Lofi Girl Sleeping Beats',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: 'Live Stream',
    category: 'lofi',
    embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Deep Sleep Delta Waves & Mellow Guitar] ♪',
      '♪ [Slow Ambient Soundscape for Deep Rest] ♪',
    ],
  },

  // -------------------------------------------------------------
  // CLASSICAL & CINEMATIC OST
  // -------------------------------------------------------------
  {
    id: 'yt-c1',
    videoId: '_4kHxtwSRZ4',
    title: 'Für Elise & Classical Piano Masterpieces',
    artist: 'Ludwig van Beethoven',
    thumbnail: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=400&q=80',
    duration: '1:45:00',
    category: 'classical',
    embedUrl: 'https://www.youtube.com/embed/_4kHxtwSRZ4?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Classical Bagatelle in A Minor, WoO 59 - Allegretto] ♪',
      '♪ [Delicate Poetic Right-Hand Arpeggios] ♪',
      '♪ [Emotional Chromatic Sequences & Virtuosic Flourishes] ♪',
      '♪ [Timeless Beethoven Piano Resonance] ♪',
    ],
  },
  {
    id: 'yt-c2',
    videoId: 'UDVtMYqUAyw',
    title: 'Interstellar Main Theme (First Step)',
    artist: 'Hans Zimmer (Orchestral Score)',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '5:48',
    category: 'classical',
    embedUrl: 'https://www.youtube.com/embed/UDVtMYqUAyw?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Towering Church Organ Rising in Epic Crescendo] ♪',
      '♪ [Cosmic Gravity & Human Courage Symphony] ♪',
      '♪ [Deep Strings Swelling into Infinity] ♪',
    ],
  },
  {
    id: 'yt-c3',
    videoId: '7maJOI3QMu0',
    title: 'River Flows in You',
    artist: 'Yiruma',
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    duration: '3:08',
    category: 'classical',
    embedUrl: 'https://www.youtube.com/embed/7maJOI3QMu0?autoplay=1&enablejsapi=1',
    lyrics: [
      '♪ [Melancholic Contemporary Neoclassical Piano] ♪',
      '♪ [Gentle Cascading Melodies & Emotional Flow] ♪',
    ],
  },

  // -------------------------------------------------------------
  // DEVOTIONAL & MEDITATIVE
  // -------------------------------------------------------------
  {
    id: 'yt-d1',
    videoId: 'AETFvQonfV8',
    title: 'Shri Hanuman Chalisa',
    artist: 'Gulshan Kumar, Hariharan',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    duration: '9:42',
    category: 'devotional',
    embedUrl: 'https://www.youtube.com/embed/AETFvQonfV8?autoplay=1&enablejsapi=1',
    lyrics: [
      'Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari...',
      'Barnau Raghuvar Bimal Jasu, Jo Dayaku Phal Chari!',
      'Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihun Lok Ujagar',
      'Ramdoot Atulit Baldhama, Anjani Putra Pavansut Nama!',
      'Mahabir Bikram Bajrangi, Kumati Nivar Sumati Ke Sangi...',
      'Bhoot Pishach Nikat Nahi Aavai, Mahavir Jab Naam Sunavai!',
    ],
  },
  {
    id: 'yt-d2',
    videoId: '8v_4O44sfjM',
    title: 'Om Chanting at 432Hz - Deep Healing Meditation',
    artist: 'Meditative Mind',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    duration: '1:00:00',
    category: 'devotional',
    embedUrl: 'https://www.youtube.com/embed/8v_4O44sfjM?autoplay=1&enablejsapi=1',
    lyrics: [
      'ॐ (OM) - The Primordial Sound of the Universe',
      '♪ [432Hz Harmonic Frequency for Stress Release & Deep Serenity] ♪',
      '♪ [Chakra Alignment & Cellular Healing Vibration] ♪',
    ],
  },
];

export const POPULAR_SPOTIFY_TRACKS: SpotifyTrack[] = [
  // -------------------------------------------------------------
  // USER FEATURED PLAYLIST (HIGH PRIORITY)
  // -------------------------------------------------------------
  {
    id: 'sp-user-playlist-3ZbskVQR',
    title: 'Curated Vibes & Hits Playlist',
    artist: 'Spotify Mix',
    album: 'Custom User Playlist',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/3ZbskVQR5OqKJmZJ3plkLR?si=9HZJxB9zQ1OVSM5hNWaOsw',
    embedUrl: 'https://open.spotify.com/embed/playlist/3ZbskVQR5OqKJmZJ3plkLR?utm_source=generator&theme=0',
    duration: 'Full Playlist Stream',
    category: 'trending',
    lyrics: [
      '♪ [Now Streaming Spotify Playlist: 3ZbskVQR5OqKJmZJ3plkLR] ♪',
      '♪ [High-Fidelity Curated Audio Tracklist] ♪',
      '♪ [Enjoy your personalized Spotify playlist on Myraa OS] ♪',
    ],
  },

  // -------------------------------------------------------------
  // GLOBAL & TOP HITS SPOTIFY
  // -------------------------------------------------------------
  {
    id: 'sp-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    embedUrl: 'https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?utm_source=generator&theme=0',
    duration: '3:20',
    category: 'pop',
    lyrics: [
      'I\'ve been on my own for long enough...',
      'Maybe you can show me how to love, maybe',
      'I\'m blinded by the lights, no I can\'t sleep until I feel your touch!',
    ],
  },
  {
    id: 'sp-2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
    embedUrl: 'https://open.spotify.com/embed/track/7qiZfU4dY1lWllzX7mPBI3?utm_source=generator&theme=0',
    duration: '3:53',
    category: 'pop',
    lyrics: [
      'I\'m in love with the shape of you...',
      'We push and pull like a magnet do',
      'Although my heart is falling too, I\'m in love with your body!',
    ],
  },
  {
    id: 'sp-3',
    title: 'Today\'s Top Global Hits',
    artist: 'Global Billboard Stars',
    album: 'Spotify Editorial Playlist',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0',
    duration: 'Worldwide Top 50',
    category: 'trending',
    lyrics: [
      '♪ [Global Billboard Chart Toppers & Viral Hits] ♪',
      '♪ [Taylor Swift, The Weeknd, Billie Eilish, Sabrina Carpenter, Harry Styles] ♪',
    ],
  },
  {
    id: 'sp-4',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/7MXVkk9YM5IZxh0wAEvism',
    embedUrl: 'https://open.spotify.com/embed/track/7MXVkk9YM5IZxh0wAEvism?utm_source=generator&theme=0',
    duration: '3:50',
    category: 'pop',
    lyrics: [
      'Look what you\'ve done, I\'m a motherfuckin\' starboy!',
      'Every day a star is born, clap if you feel it...',
    ],
  },
  {
    id: 'sp-5',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/4LRPiXqCikLlN15c3yZA47',
    embedUrl: 'https://open.spotify.com/embed/track/4LRPiXqCikLlN15c3yZA47?utm_source=generator&theme=0',
    duration: '2:47',
    category: 'pop',
    lyrics: [
      'You know it\'s not the same as it was...',
      'In this world, it\'s just us, you know it\'s not the same as it was!',
    ],
  },
  {
    id: 'sp-6',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr',
    embedUrl: 'https://open.spotify.com/embed/track/1BxfuPKGuaTgP7aM0Bbdwr?utm_source=generator&theme=0',
    duration: '2:58',
    category: 'pop',
    lyrics: [
      'And it\'s new, the shape of your body, it\'s blue...',
      'It\'s a cruel summer with you!',
    ],
  },

  // -------------------------------------------------------------
  // BOLLYWOOD & HINDI SPOTIFY
  // -------------------------------------------------------------
  {
    id: 'sp-7',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Brahmāstra Soundtrack',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/6WzGne56sA9qP3h4Q1r7f5',
    embedUrl: 'https://open.spotify.com/embed/track/6WzGne56sA9qP3h4Q1r7f5?utm_source=generator&theme=0',
    duration: '4:28',
    category: 'bollywood',
    lyrics: [
      'Kesariya tera ishq hai piya...',
      'Rang jaaun jo main haath lagaun,',
      'Din beete saara teri fikr mein, rain saari teri khair manaun!',
    ],
  },
  {
    id: 'sp-8',
    title: 'Bollywood Butter Hits',
    artist: 'Top Indian Artists',
    album: 'Spotify Editorial Playlist',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM?utm_source=generator&theme=0',
    duration: 'Curated Playlist',
    category: 'bollywood',
    lyrics: [
      '♪ [Best of Modern Bollywood & Chartbuster Hindi Beats] ♪',
      '♪ [Arijit Singh, Diljit Dosanjh, Shreya Ghoshal, Badshah, Jubin Nautiyal] ♪',
    ],
  },
  {
    id: 'sp-9',
    title: 'Deewana & 90s Bollywood Classics',
    artist: 'Kumar Sanu, Alka Yagnik',
    album: 'Golden Era Romance',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DXa2hu2JzE6W1',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXa2hu2JzE6W1?utm_source=generator&theme=0',
    duration: 'Top Album Playlist',
    category: 'bollywood',
    lyrics: [
      'Dheere dheere se meri zindagi mein aana...',
      'Dheere dheere se dil ko churaana!',
      'Tumse pyaar humein hai kitna jaane jaana...',
    ],
  },
  {
    id: 'sp-10',
    title: 'Naam Hai Tera - Aap Kaa Surroor',
    artist: 'Himesh Reshammiya',
    album: 'Aap Kaa Surroor (Original)',
    coverUrl: 'https://img.youtube.com/vi/DULrvDVqyXI/hqdefault.jpg',
    spotifyUri: 'https://open.spotify.com/track/6WzGne56sA9qP3h4Q1r7f5',
    embedUrl: 'https://open.spotify.com/embed/track/6WzGne56sA9qP3h4Q1r7f5?utm_source=generator&theme=0',
    duration: '4:47',
    category: 'bollywood',
    lyrics: [
      'Dil ki surkhiyon mein hai tera naam...',
      'Naam hai tera tera, naam hai tera tera!',
      'Aap kaa surroor, meri jaan hai tu...',
    ],
  },
  {
    id: 'sp-11',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh, Mithoon',
    album: 'Aashiqui 2',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/56zZ48j9nS6yq3Q0H1W4eS',
    embedUrl: 'https://open.spotify.com/embed/track/56zZ48j9nS6yq3Q0H1W4eS?utm_source=generator&theme=0',
    duration: '4:22',
    category: 'bollywood',
    lyrics: [
      'Kyunki tum hi ho, ab tum hi ho...',
      'Zindagi ab tum hi ho!',
    ],
  },

  // -------------------------------------------------------------
  // PUNJABI & DESI SPOTIFY
  // -------------------------------------------------------------
  {
    id: 'sp-12',
    title: 'Hot Hits Punjabi',
    artist: 'Diljit Dosanjh, AP Dhillon, Karan Aujla',
    album: 'Spotify Editorial Playlist',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DX5cZuTNxDhAU',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5cZuTNxDhAU?utm_source=generator&theme=0',
    duration: 'Punjabi Top Hits',
    category: 'punjabi',
    lyrics: [
      '♪ [Hottest Punjabi Trap, Bhangra & Melodic Hits] ♪',
      '♪ [Diljit Dosanjh, AP Dhillon, Karan Aujla, Sidhu Moose Wala] ♪',
    ],
  },
  {
    id: 'sp-13',
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    album: 'MoonChild Era',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/track/6UOD03hQoK8V0Yk9p4G1K2',
    embedUrl: 'https://open.spotify.com/embed/track/6UOD03hQoK8V0Yk9p4G1K2?utm_source=generator&theme=0',
    duration: '3:12',
    category: 'punjabi',
    lyrics: [
      'Tera ni mai lover, saare kehn de mai kamla...',
      'Tenu dil ditta, tu sambhle ya tod de!',
    ],
  },

  // -------------------------------------------------------------
  // FOCUS, LOFI & CHILL SPOTIFY
  // -------------------------------------------------------------
  {
    id: 'sp-14',
    title: 'Deep Focus Flow',
    artist: 'Spotify Studios Ambient',
    album: 'Alpha Waves for Productivity',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
    duration: 'Focus Playlist',
    category: 'focus',
    lyrics: [
      '♪ [Subtle Atmospheric Synth Textures & Binaural Beats] ♪',
      '♪ [Ideal for Coding, Deep Work, Reading, and Problem Solving] ♪',
    ],
  },
  {
    id: 'sp-15',
    title: 'Chill Lofi Beats',
    artist: 'Lofi Records Collective',
    album: 'Late Night Chill & Relax',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    duration: 'Lofi Playlist',
    category: 'lofi',
    lyrics: [
      '♪ [Warm Vinyl Tape Hiss & Mellow Acoustic Chords] ♪',
      '♪ [Jazzy Snare Patterns & Relaxing Midnight Melodies] ♪',
    ],
  },
  {
    id: 'sp-16',
    title: 'Beast Mode Gym Workout',
    artist: 'High Energy Electronic & Rap',
    album: 'Power Training Mix',
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0',
    duration: 'High BPM Mix',
    category: 'workout',
    lyrics: [
      '♪ [Aggressive Bass Drops & High Cadence Beats] ♪',
      '♪ [Designed to Push Peak Performance and Focus] ♪',
    ],
  },
  {
    id: 'sp-17',
    title: 'Peaceful Piano Masterworks',
    artist: 'Ludovico Einaudi, Yiruma, Max Richter',
    album: 'Neoclassical Peace',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=400&q=80',
    spotifyUri: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    duration: 'Calm Piano',
    category: 'classical',
    lyrics: [
      '♪ [Gentle Acoustic Piano Harmonies & Serene Space] ♪',
      '♪ [Relaxation, Stress Relief & Mindful Unwinding] ♪',
    ],
  },
];

/**
 * Extracts a valid YouTube Video ID from any URL, iframe string, or short link.
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. Direct 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. youtube.com/watch?v=ID or /v/ID or /embed/ID or shorts/ID
  const regExp =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // 3. YouTube Playlist URL with list=
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (listMatch && listMatch[1]) {
    return listMatch[1];
  }

  return null;
}

/**
 * Extracts Spotify ID and Type (track, playlist, album, artist) from any URL or URI.
 */
export function extractSpotifyEmbedInfo(input: string): { type: 'track' | 'playlist' | 'album' | 'artist'; id: string; embedUrl: string } | null {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. Check spotify URI format: spotify:track:XXX or spotify:playlist:XXX
  const uriMatch = trimmed.match(/spotify:(track|playlist|album|artist):([a-zA-Z0-9]+)/);
  if (uriMatch) {
    const type = uriMatch[1] as 'track' | 'playlist' | 'album' | 'artist';
    const id = uriMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
    };
  }

  // 2. Check open.spotify.com URL format: https://open.spotify.com/track/XXX
  const urlMatch = trimmed.match(/open\.spotify\.com\/(?:embed\/)?(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
  if (urlMatch) {
    const type = urlMatch[1] as 'track' | 'playlist' | 'album' | 'artist';
    const id = urlMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
    };
  }

  return null;
}

/**
 * Retrieves full array of YouTube tracks, optionally filtered by category.
 */
export function getAllYouTubeTracks(category?: string): YouTubeTrack[] {
  if (!category || category === 'all') {
    return [...POPULAR_YOUTUBE_TRACKS];
  }
  return POPULAR_YOUTUBE_TRACKS.filter((t) => t.category === category);
}

/**
 * Retrieves full array of Spotify tracks, optionally filtered by category.
 */
export function getAllSpotifyTracks(category?: string): SpotifyTrack[] {
  if (!category || category === 'all') {
    return [...POPULAR_SPOTIFY_TRACKS];
  }
  return POPULAR_SPOTIFY_TRACKS.filter((t) => t.category === category);
}

/**
 * Dynamically resolves or generates a playable YouTube track for ANY query in the world.
 */
export function findYouTubeTrack(query: string): YouTubeTrack {
  const cleanQuery = (query || '').trim();
  const lower = cleanQuery.toLowerCase();

  if (!lower) {
    return POPULAR_YOUTUBE_TRACKS[0];
  }

  // 1. Check if user provided direct YouTube link or ID
  const directId = extractYouTubeVideoId(cleanQuery);
  if (directId) {
    const existing = POPULAR_YOUTUBE_TRACKS.find((t) => t.videoId === directId);
    if (existing) return existing;

    return {
      id: `yt-custom-${directId}`,
      videoId: directId,
      title: cleanQuery.includes('http') ? 'Custom YouTube Stream' : cleanQuery,
      artist: 'YouTube Media',
      thumbnail: `https://img.youtube.com/vi/${directId}/hqdefault.jpg`,
      duration: 'Live Stream',
      category: 'trending',
      embedUrl: `https://www.youtube.com/embed/${directId}?autoplay=1&enablejsapi=1`,
      lyrics: [
        `♪ [Streaming from YouTube: ${cleanQuery}] ♪`,
        '♪ [Real-time High Fidelity Audio Engine Active] ♪',
      ],
    };
  }

  // 2. Direct exact or substring match in catalog
  const found = POPULAR_YOUTUBE_TRACKS.find(
    (t) =>
      t.title.toLowerCase() === lower ||
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      lower.includes(t.title.toLowerCase()) ||
      lower.includes(t.artist.toLowerCase())
  );

  if (found) {
    return found;
  }

  // 3. Multi-token keywords and artist match
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  for (const track of POPULAR_YOUTUBE_TRACKS) {
    const trackText = `${track.title} ${track.artist} ${track.category}`.toLowerCase();
    const matchCount = words.filter((w) => trackText.includes(w)).length;
    if (matchCount >= 2 || (words.length === 1 && matchCount === 1)) {
      return track;
    }
  }

  // 4. Specific artist & song keyword heuristics
  if (lower.includes('naam hai tera') || lower.includes('himesh') || lower.includes('surroor') || lower.includes('tera tera')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('kesariya') || lower.includes('brahmastra')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('tum hi ho') || lower.includes('aashiqui')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('channa') || lower.includes('ae dil')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b4') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('apna bana le') || lower.includes('bhediya')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b5') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('raataan') || lower.includes('shershaah') || lower.includes('jubin')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b6') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('deewana') || lower.includes('90') || lower.includes('sanu') || lower.includes('kumar sanu')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b7') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('kal ho') || lower.includes('sonu nigam')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b8') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('kun faya') || lower.includes('rockstar') || lower.includes('rahman')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b9') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('agar tum') || lower.includes('tamasha')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b10') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('animal') || lower.includes('pehle bhi') || lower.includes('satranga')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-b11' || t.id === 'yt-b12') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('lover') || lower.includes('diljit') || lower.includes('goat')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-p1' || t.id === 'yt-p2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('brown munde') || lower.includes('ap dhillon') || lower.includes('excuses')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-p3' || t.id === 'yt-p4') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('tauba') || lower.includes('karan aujla')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-p5') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('pasoori') || lower.includes('ali sethi')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-p6') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('295') || lower.includes('moose') || lower.includes('sidhu')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-p7') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('naatu') || lower.includes('rrr')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-s1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('arabic kuthu') || lower.includes('beast') || lower.includes('anirudh')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-s2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('oo antava') || lower.includes('pushpa')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-s3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('blinding lights') || lower.includes('weeknd')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('shape of you') || lower.includes('ed sheeran')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('starboy')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('harry styles') || lower.includes('as it was')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g4') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('flowers') || lower.includes('miley')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g5') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('taylor swift') || lower.includes('cruel summer')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g6') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('espresso') || lower.includes('sabrina')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g7') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('levitating') || lower.includes('dua lipa')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g8') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('bohemian') || lower.includes('queen')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g9') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('despacito')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g10') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('coldplay') || lower.includes('weekend')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-g11') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('faded') || lower.includes('alan walker')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-e1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('avicii') || lower.includes('levels') || lower.includes('wake me up')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-e2' || t.id === 'yt-e4') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('closer') || lower.includes('chainsmokers')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-e3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('animals') || lower.includes('garrix')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-e5') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('eminem') || lower.includes('lose yourself')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-h1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('kendrick') || lower.includes('humble')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-h2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('drake') || lower.includes('god\'s plan') || lower.includes('gods plan')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-h3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('linkin park') || lower.includes('numb') || lower.includes('in the end')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-r1' || t.id === 'yt-r2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('believer') || lower.includes('imagine dragons')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-r3') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('lofi') || lower.includes('chill') || lower.includes('study')) {
    return lower.includes('synth') ? POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-l2')! : POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-l1')!;
  }
  if (lower.includes('classical') || lower.includes('beethoven') || lower.includes('piano')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-c1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('interstellar') || lower.includes('zimmer')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-c2') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('hanuman') || lower.includes('chalisa')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-d1') || POPULAR_YOUTUBE_TRACKS[0];
  }
  if (lower.includes('om') || lower.includes('mantra') || lower.includes('meditation')) {
    return POPULAR_YOUTUBE_TRACKS.find((t) => t.id === 'yt-d2') || POPULAR_YOUTUBE_TRACKS[0];
  }

  // 5. Universal Fallback: Dynamic YouTube Search List Embed that plays ANY song query instantly
  const formattedTitle = cleanQuery
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: `yt-search-${Date.now()}`,
    videoId: `search-${encodeURIComponent(cleanQuery)}`,
    title: formattedTitle,
    artist: 'YouTube Live Audio & Video Stream',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    duration: 'Full Track',
    category: 'trending',
    embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(cleanQuery)}&autoplay=1&enablejsapi=1`,
    lyrics: [
      `♪ [Now Playing: "${formattedTitle}"] ♪`,
      '♪ [Streaming official audio from YouTube] ♪',
      '♪ [Enjoy your music on Myraa OS] ♪',
    ],
  };
}

/**
 * Searches for a Spotify track/playlist by title/query with guaranteed working embeds.
 */
export function findSpotifyTrack(query: string): SpotifyTrack {
  const cleanQuery = (query || '').trim();
  const lower = cleanQuery.toLowerCase();

  if (!lower) {
    return POPULAR_SPOTIFY_TRACKS[0];
  }

  // 1. Check if user provided direct Spotify URI or URL
  const embedInfo = extractSpotifyEmbedInfo(cleanQuery);
  if (embedInfo) {
    return {
      id: `sp-custom-${embedInfo.id}`,
      title: `${embedInfo.type.toUpperCase()}: ${embedInfo.id}`,
      artist: 'Spotify Stream',
      album: 'Custom Spotify Media',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      spotifyUri: cleanQuery,
      embedUrl: embedInfo.embedUrl,
      duration: 'Live Embed',
      category: 'trending',
      lyrics: [
        `♪ [Connected to Spotify ${embedInfo.type}: ${embedInfo.id}] ♪`,
        '♪ [High Fidelity Spotify Audio Player Active] ♪',
      ],
    };
  }

  // 2. Direct exact or substring match in catalog
  const found = POPULAR_SPOTIFY_TRACKS.find(
    (t) =>
      t.title.toLowerCase() === lower ||
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      t.album.toLowerCase().includes(lower) ||
      lower.includes(t.title.toLowerCase()) ||
      lower.includes(t.artist.toLowerCase())
  );

  if (found) {
    return found;
  }

  // 3. Multi-token keywords and artist match
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  for (const track of POPULAR_SPOTIFY_TRACKS) {
    const trackText = `${track.title} ${track.artist} ${track.album} ${track.category}`.toLowerCase();
    const matchCount = words.filter((w) => trackText.includes(w)).length;
    if (matchCount >= 2 || (words.length === 1 && matchCount === 1)) {
      return track;
    }
  }

  // 4. Keyword & genre mapping to Spotify playlists & tracks
  if (
    lower.includes('3zbskvqr') ||
    lower.includes('my playlist') ||
    lower.includes('user playlist') ||
    lower.includes('custom playlist') ||
    lower.includes('curated playlist') ||
    lower.includes('myraa playlist') ||
    lower.includes('vibes playlist') ||
    lower.includes('hits playlist')
  ) {
    return POPULAR_SPOTIFY_TRACKS[0]; // The custom user playlist
  }
  if (lower.includes('naam hai tera') || lower.includes('himesh') || lower.includes('surroor') || lower.includes('tera tera')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-10') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('kesariya') || lower.includes('brahmastra')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-7') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('tum hi ho') || lower.includes('aashiqui')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-11') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('deewana') || lower.includes('90') || lower.includes('sanu')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-9') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('punjabi') || lower.includes('ap dhillon') || lower.includes('karan aujla')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-12') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('lover') || lower.includes('diljit')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-13') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('bollywood') || lower.includes('hindi') || lower.includes('arijit')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-8') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('lofi') || lower.includes('chill') || lower.includes('relax')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-15') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('focus') || lower.includes('study') || lower.includes('work') || lower.includes('code')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-14') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('cardio')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-16') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('piano') || lower.includes('classical')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-17') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('shape of you') || lower.includes('ed sheeran')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-2') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('starboy')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-4') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('as it was') || lower.includes('harry styles')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-5') || POPULAR_SPOTIFY_TRACKS[0];
  }
  if (lower.includes('cruel summer') || lower.includes('taylor swift')) {
    return POPULAR_SPOTIFY_TRACKS.find((t) => t.id === 'sp-6') || POPULAR_SPOTIFY_TRACKS[0];
  }

  // 5. Universal Spotify Global Hits Fallback
  return POPULAR_SPOTIFY_TRACKS[2];
}

export const YOUTUBE_CATALOG = POPULAR_YOUTUBE_TRACKS;
export const SPOTIFY_CATALOG = POPULAR_SPOTIFY_TRACKS;
