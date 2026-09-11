export const weddingData = {
  bride: {
    firstName: "Anuja",
    fullName: "Anuja George",
    father: "George Joseph",
    mother: "Sally George",
    siblings: ["Anumoi George", "Dr. Jeeva George"],
    bio: "Anuja works as a nurse in Ireland.",
    instagram: "anujakuzhippillil",
  },
  groom: {
    firstName: "Jeremy",
    fullName: "Jeremy Johnson",
    father: "Johnson C. George",
    mother: "Sibil Johnson",
    siblings: ["Justin Johnson", "Jasmin Johnson"],
    bio: "An RN-BSN and NP, Jeremy works as a nurse in America.",
    instagram: "lemonhammer24",
  },
  story: {
    title: "It Was Always You",
    text: "What started with a simple conversation through matrimony became a beautiful journey of friendship, love, and togetherness. From our first ‘hello’ to choosing forever, we found in each other our best friend, our partner, and our person. We found love, we found forever, and we can’t wait to say ‘I do.’",
  },
  couple: {
    quote: "Forever sounds perfect when it’s with you.",
    hashtag: "#AJToForever",
  },
  bibleVerse: {
    text: "I have found the one whom my soul loves.",
    reference: "Song of Solomon 3:4",
  },
  engagement: {
    date: "2026-11-02T11:00:00+05:30",
    time: "11:00 AM",
    ceremony: {
      name: "Marth Mariyam Town Church",
      address: "Thodupuzha–Moolamattom Road (SH42), Muttom, Idukki, Kerala 685587, India",
      time: "11:00 AM",
      mapsUrl: "https://maps.app.goo.gl/1Ty4wAHNNYitdvEL7?g_st=ic",
      embedUrl: "https://www.google.com/maps?q=Marth+Mariyam+Town+Church+Muttom+Idukki+Kerala+685587&output=embed",
    },
    reception: {
      name: "Madaparambil Wedding Hall",
      address: "River Banks Madapparambil Resort, Idukki Road, Mrala, Karimkunnam, Thodupuzha, Kerala 685584, India",
      time: "12:30 PM",
      mapsUrl: "https://maps.app.goo.gl/mpdirSfyQsDq1eGP9?g_st=ic",
      embedUrl: "https://www.google.com/maps?q=Madaparambil+Wedding+Hall+Mrala+Thodupuzha+Kerala+685584&output=embed",
    },
  },
  wedding: {
    date: "2026-11-07T10:00:00+05:30",
    time: "10:00 AM",
    church: {
      name: "St George Syriac Orthodox Simhasana Church",
      address: "9HPG+JX3, SH7, Thiruvalla, Kerala 689101, India",
      time: "10:00 AM",
      mapsUrl: "https://www.google.com/maps/place/St+George+Syriac+Orthodox+Simhasana+Church/@9.3865232,76.5774479,17z",
      embedUrl: "https://www.google.com/maps?q=St+George+Syriac+Orthodox+Simhasana+Church+Thiruvalla&output=embed",
    },
    reception: {
      name: "St John’s Metropolitan Hall (A/C)",
      address: "9HHC+G26, SH 6, Thiruvalla, Kerala 689101, India",
      time: "12:00 PM",
      mapsUrl: "https://www.google.com/maps/place/St+John's+Metropolitan+Hall+(A%2Fc)/@9.3787953,76.5700038,15z",
      embedUrl: "https://www.google.com/maps?q=St+John%27s+Metropolitan+Hall+Thiruvalla&output=embed",
    },
  },
  images: {
    hero: { src: "/images/DSC09342.jpg", position: "50% 68%" },
    story: { src: "/images/DSC09614-2.jpg", position: "50% 54%" },
    gallery: [
      { src: "/images/DSC09623.jpg", alt: "Anuja and Jeremy embracing in the countryside" },
      { src: "/images/DSC09578.jpg", alt: "Anuja and Jeremy smiling together beside their car" },
      { src: "/images/DSC09318-1.jpg", alt: "Anuja and Jeremy walking hand in hand" },
      { src: "/images/DSC09446.jpg", alt: "Anuja and Jeremy sharing a quiet moment" },
      { src: "/images/DSC09342.jpg", alt: "Anuja and Jeremy sharing a joyful moment in the countryside" },
    ],
    final: { src: "/images/DSC09318.jpg", position: "50% 63%" },
  },
  wedify: {
    name: "Wedify",
    logo: "/logos/wedify.svg",
    instagram: "https://instagram.com/wedify_invites",
    website: "https://wedify.example",
    contact: "hello@wedify.example",
  },
  photographer: {
    name: "T J Photography",
    logo: "/logos/tj-photography.png",
    instagram: "https://instagram.com/tj_photography_1",
  },
  music: "/audio/i-think-they-call-this-love-cover.mp3",
  shareText: "Come celebrate our love with us as Anuja & Jeremy say ‘I do.’ View our invitation: {url} #AJToForever",
};

export type EventKey = "engagement" | "wedding";
