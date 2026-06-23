"use strict";

const sampleText = "FontVibe";
const maxHistoryItems = 8;
let activeStyleFilter = "Todos";
let activeSymbolCategory = "Corações";

const maps = {
  bold: createMap(0x1d400, 0x1d41a, 0x1d7ce),
  italic: createMap(0x1d434, 0x1d44e, null, { h: "ℎ" }),
  boldItalic: createMap(0x1d468, 0x1d482, null),
  script: createMap(0x1d49c, 0x1d4b6, null, { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" }),
  boldScript: createMap(0x1d4d0, 0x1d4ea, null),
  fraktur: createMap(0x1d504, 0x1d51e, null, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" }),
  boldFraktur: createMap(0x1d56c, 0x1d586, null),
  double: createMap(0x1d538, 0x1d552, 0x1d7d8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" }),
  sans: createMap(0x1d5a0, 0x1d5ba, 0x1d7e2),
  sansBold: createMap(0x1d5d4, 0x1d5ee, 0x1d7ec),
  sansItalic: createMap(0x1d608, 0x1d622, null),
  sansBoldItalic: createMap(0x1d63c, 0x1d656, null),
  mono: createMap(0x1d670, 0x1d68a, 0x1d7f6),
  fullwidth: createFullwidthMap(),
  circled: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"),
  negativeCircled: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩⓿❶❷❸❹❺❻❼❽❾"),
  squared: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"),
  negativeSquared: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"),
  smallCaps: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ"),
  superscript: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "ᴬᴮꟲᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹"),
  subscript: createRangeMap("abcdefghijklmnopqrstuvwxyz0123456789+-=()", "ₐᵦ꜀ᑯₑբ₉ₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓᵧ₂₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎"),
  upside: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!().,", "∀𐐒ƆᗡƎℲ⅁HIſꓘ˥WNOԀΌᴚS⊥∩ΛMX⅄Zɐqɔpǝɟƃɥᴉɾʞןɯuodbɹsʇnʌʍxʎz0ƖᄅƐㄣϛ9ㄥ86¿¡)(˙'"),
  mirrored: createRangeMap("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", "AᙠƆᗡƎᖷᎮHIႱꓘ⅃MИOꟼỌЯƧTUVWXYZɒdɔbɘʇǫʜiꞁʞlmᴎoqɿꙅƚuvwxyz")
};

const styles = [
  ["Normal", text => text],
  ["Negrito", text => convert(text, maps.bold)],
  ["Itálico", text => convert(text, maps.italic)],
  ["Negrito Itálico", text => convert(text, maps.boldItalic)],
  ["Cursivo", text => convert(text, maps.script)],
  ["Cursivo Premium", text => convert(text, maps.boldScript)],
  ["Gótico", text => convert(text, maps.fraktur)],
  ["Dark", text => convert(text, maps.boldFraktur)],
  ["Double", text => convert(text, maps.double)],
  ["Sans", text => convert(text, maps.sans)],
  ["Sans Negrito", text => convert(text, maps.sansBold)],
  ["Sans Itálico", text => convert(text, maps.sansItalic)],
  ["Sans Forte", text => convert(text, maps.sansBoldItalic)],
  ["Monospace", text => convert(text, maps.mono)],
  ["Box", text => convert(text.toUpperCase(), maps.squared)],
  ["Box Preto", text => convert(text.toUpperCase(), maps.negativeSquared)],
  ["Circular", text => convert(text, maps.circled)],
  ["Circular Preto", text => convert(text.toUpperCase(), maps.negativeCircled)],
  ["Style", text => convert(text, maps.fullwidth)],
  ["Super", text => convert(text, maps.superscript)],
  ["Sub", text => convert(text.toLowerCase(), maps.subscript)],
  ["Pequeno", text => convert(text, maps.smallCaps)],
  ["Invertido", text => convert(reverse(text), maps.upside)],
  ["Espelhado", text => convert(text, maps.mirrored)],
  ["Estrelado", text => decorate(text, "✦", "✦")],
  ["Corações", text => decorate(text, "♡", "♡")],
  ["Neon", text => decorate(text, "✧", "✧")],
  ["Luxo", text => decorate(text, "༺", "༻")],
  ["Gamer", text => decorate(text, "꧁", "꧂")],
  ["Free Fire", text => decorate(text, "么", "亗")],
  ["TikTok", text => decorate(text, "♪", "♬")],
  ["Discord", text => decorate(text, "「", "」")],
  ["Minimal", text => decorate(text, "·", "·")],
  ["Coroa", text => decorate(text, "♛", "♛")],
  ["Flor", text => decorate(text, "❀", "❀")],
  ["Setas", text => decorate(text, "➜", "➜")],
  ["Chamas", text => decorate(text, "🔥", "🔥")],
  ["Diamante", text => decorate(text, "◇", "◇")],
  ["Bracket", text => decorate(text, "【", "】")],
  ["Soft", text => spaced(text, " ")],
  ["Wide Plus", text => spaced(convert(text, maps.fullwidth), " ")],
  ["Pontilhado", text => spaced(text, "·")],
  ["Traçado", text => spaced(text, "-")],
  ["Underscore", text => text.split("").join("_")],
  ["Vapor", text => `『 ${convert(text, maps.fullwidth)} 』`],
  ["Kawaii", text => `♡ ${text} ♡`],
  ["Royal", text => `♕ ${text} ♕`],
  ["Magic", text => `⋆｡˚ ${text} ˚｡⋆`],
  ["Cyber", text => `⟪ ${convert(text, maps.sansBold)} ⟫`],
  ["Elite", text => `⫷ ${convert(text, maps.bold)} ⫸`],
  ["Ninja", text => `卍 ${text} 卍`],
  ["Angel", text => `꒰ঌ ${text} ໒꒱`],
  ["Devil", text => `⛧ ${text} ⛧`],
  ["Wave", text => `≈ ${text} ≈`],
  ["Spark", text => `✦ ${spaced(text, " ✦ ")} ✦`],
  ["Slash", text => `/${text}/`],
  ["Line", text => `| ${text} |`],
  ["Quote", text => `“${text}”`],
  ["Cloud", text => `☁ ${text} ☁`],
  ["Moon", text => `☾ ${text} ☽`],
  ["Sun", text => `☀ ${text} ☀`],
  ["Music", text => `♫ ${text} ♫`],
  ["Game", text => `✘ ${text} ✘`],
  ["Cute", text => `ଘ ${text} ଓ`],
  ["Rare", text => `𓆩 ${text} 𓆪`],
  ["Clean", text => `〔 ${text} 〕`],
  ["Pro", text => `《 ${convert(text, maps.bold)} 》`],
  ["Instagram Bio", text => `✧･ﾟ ${convert(text, maps.script)} ･ﾟ✧`],
  ["TikTok Viral", text => `♬ ${convert(text, maps.sansBold)} ♬`],
  ["Free Fire Mestre", text => `꧁ঔৣ☬${text}☬ঔৣ꧂`],
  ["Clã Gamer", text => `ᶜᴸᴬᴺ ${convert(text, maps.smallCaps)}`],
  ["Discord Tag", text => `# ${convert(text, maps.mono)}`],
  ["WhatsApp Status", text => `❝ ${text} ❞`],
  ["Aesthetic", text => `☁︎ ${spaced(text.toLowerCase(), " ")} ☁︎`],
  ["Soft Girl", text => `୨୧ ${convert(text, maps.script)} ୨୧`],
  ["Dark Bio", text => `⛓ ${convert(text, maps.boldFraktur)} ⛓`],
  ["Pixel", text => `▣ ${convert(text, maps.mono)} ▣`],
  ["Arcade", text => `▶ ${convert(text, maps.fullwidth)} ◀`],
  ["VIP", text => `✪ VIP ${convert(text, maps.bold)} ✪`],
  ["Champion", text => `🏆 ${text} 🏆`],
  ["Fire Name", text => `꧁🔥${text}🔥꧂`],
  ["Ice Name", text => `❄ ${text} ❄`],
  ["Galaxy", text => `✧ ${text} ☄`],
  ["Planet", text => `🪐 ${text} 🪐`],
  ["Heart Bio", text => `ღ ${convert(text, maps.italic)} ღ`],
  ["Crown Elite", text => `♕ ${convert(text, maps.double)} ♕`],
  ["Skull", text => `☠ ${text} ☠`],
  ["Dragon", text => `龍 ${text} 龍`],
  ["Samurai", text => `侍 ${text} 侍`],
  ["Shadow", text => `░${spaced(text, "░")}░`],
  ["Glitch", text => `z̷ ${text} z̷`],
  ["Underline", text => Array.from(text).map(char => `${char}\u0332`).join("")],
  ["Strike", text => Array.from(text).map(char => `${char}\u0336`).join("")],
  ["Bubble Mix", text => `◌ ${convert(text, maps.circled)} ◌`],
  ["Square Mix", text => `▰ ${convert(text.toUpperCase(), maps.squared)} ▰`],
  ["Royal Gamer", text => `꧁♛ ${text} ♛꧂`],
  ["Name Pro", text => `ツ ${convert(text, maps.sansBoldItalic)} ツ`],
  ["Japonesa", text => `「${text}」`],
  ["Katana", text => `刀 ${text} 刀`],
  ["Anime", text => `『${convert(text, maps.smallCaps)}』`],
  ["Korean Vibe", text => `♡ ${text} ᵕ̈`],
  ["Y2K", text => `✩ ${spaced(text, ".")} ✩`],
  ["Baddie", text => `𝖝𝖔 ${convert(text, maps.boldFraktur)} 𝖝𝖔`],
  ["Princess", text => `୨ৎ ${convert(text, maps.script)} ୨ৎ`],
  ["Angel Core", text => `໒꒱ ${text} ꣑`],
  ["Money", text => `＄ ${convert(text, maps.bold)} ＄`],
  ["Hacker", text => `</ ${convert(text, maps.mono)} >`],
  ["Matrix", text => `01 ${convert(text, maps.mono)} 10`],
  ["Streamer", text => `LIVE ${text} ▶`],
  ["Bio Clean", text => `⌁ ${text.toLowerCase()} ⌁`],
  ["Bio Luxury", text => `✦ ${convert(text, maps.double)} ✦`],
  ["Bio Dark", text => `☾ ${convert(text, maps.fraktur)} ☽`],
  ["Bio Cute", text => `꒰ ${text} ꒱`],
  ["Roblox Clean", text => `${normalizeNick(text)}Playz`],
  ["Roblox Pro", text => `${normalizeNick(text)}Blox`],
  ["Roblox Rare", text => `x${normalizeNick(text)}z`],
  ["Free Fire Rush", text => `RUSH ${convert(text, maps.bold)}`],
  ["Free Fire Xit", text => `XIT ${text} ᶠᶠ`],
  ["FF Clan", text => `ᴳᴳ ${convert(text, maps.smallCaps)}`],
  ["TikTok Bio", text => `@${normalizeNick(text)} ♬`],
  ["TikTok Star", text => `✰ ${text} viral ✰`],
  ["Insta Diva", text => `𝜗𝜚 ${convert(text, maps.script)} 𝜗𝜚`],
  ["Insta Glow", text => `✧ ${text.toLowerCase()} ✧`],
  ["Luxury Crown", text => `♛ ${convert(text, maps.boldScript)} ♛`],
  ["Gold", text => `✦ GOLD ${text} ✦`],
  ["Diamond", text => `💎 ${convert(text, maps.double)} 💎`],
  ["Dark King", text => `♚ ${convert(text, maps.boldFraktur)} ♚`],
  ["Mandarim Clean", text => `字 ${text} 字`],
  ["Mandarim Dark", text => `龍 ${convert(text, maps.bold)} 影`],
  ["Mandarim Luxo", text => `帝 ${convert(text, maps.double)} 王`],
  ["Chinês Gamer", text => `战 ${normalizeNick(text)} 神`],
  ["Coreano Clean", text => `한 ${text} 글`],
  ["Coreano K-Pop", text => `♡ ${text} 민 ♡`],
  ["Coreano Dark", text => `검 ${convert(text, maps.boldFraktur)} 흑`],
  ["Hangul Style", text => `도 ${normalizeNick(text)} 빛`],
  ["Japonês Kanji", text => `神 ${text} 忍`],
  ["Japonês Sakura", text => `桜 ${convert(text, maps.script)} 桜`],
  ["Japonês Tokyo", text => `東京 ${normalizeNick(text)} 夜`],
  ["Oriental Elite", text => `王 ${convert(text, maps.boldScript)} 龍`],
  ["Asia Vibe", text => `✦ ${text} 星 ✦`],
  ["Samurai Pro", text => `侍 ${convert(text, maps.sansBold)} 忍`],
  ["K-Style", text => `아이 ${normalizeNick(text)} 스타`]
];

const symbolCategories = {
  "Corações": "♡ ♥ ❤ ❥ ❣ ❦ ❧ ღ დ ۵ 💙 💜 🖤 🤍 💗 💖 💘 💝 💞 💓 💟 ❣︎ ♡︎ 💌 💕 💔 ❤️‍🔥 ❤️‍🩹 🫶 🫰 🫀 💋",
  "Estrelas": "★ ☆ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⋆ ⁂ ⁎ ✶ ✷ ✸ ✹ ✺ ✻ ✼ ✽ ✾ ✿ ❂ ❉ ❊ ✵ ✱ ✲ ✳ ✴ ✹ 🌟 ⭐ 🌠",
  "Setas": "← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⇐ ⇒ ⇑ ⇓ ⇔ ➜ ➝ ➞ ➟ ➠ ➤ ➥ ➦ ➧ ➨ ➳ ➵ ➶ ➷ ➸ ➹ ➺ ➻ ➼ ➽ ➾ ⟵ ⟶ ⟷",
  "Coroas": "♔ ♕ ♚ ♛ 👑 𓆩♕𓆪 𓆩♛𓆪 ꙳♛꙳ ♕︎ ♛︎ ♔︎ ♚︎ ♜ ♖ ♝ ♗ ♞ ♘ ⚜ ✠ ✥ ✦ ✧ 𖤍 𖤐",
  "Flores": "❀ ✿ ❁ ✾ ✽ ✼ ❃ ❋ ✻ ⚘ ❊ ❉ 𑁍 𖤣 𖥧 𓇗 𓇬 🌸 🌺 🌷 🌹 🌻 🌼 🪷 💐 🥀 🍀 ☘ 🌿 🍃",
  "Música": "♪ ♫ ♬ ♩ ♭ ♮ ♯ 𝄞 𝄢 𝄡 𝄫 𝄪 🎵 🎶 🎧 🎤 🎼 🎹 🥁 🎸 🎷 🎺 🪗 🪘 🪕 📻",
  "Jogos": "么 亗 卍 〆 ツ 乂 彡 々 〄 ㊝ ㊣ ⚔ ⚜ ☠ ☢ ☣ ✘ ✪ 🎮 🕹 👾 🏆 🥇 🎯 🃏 ♠ ♣ ♥ ♦ 🛡",
  "Emojis especiais": "ツ シ ッ ㋡ ☻ ☺ 𓆩𓆪 ꧁꧂ ༺༻ 『』 【】 〘〙 ᕙᕗ ᵔᴥᵔ ಠ_ಠ ¯\\_(ツ)_/¯ (ง'̀-'́)ง (づ｡◕‿‿◕｡)づ",
  "Carinhas": "😀 😃 😄 😁 😆 😅 😂 🤣 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😋 😛 😜 🤪 😎 🥳 😏 😌",
  "Reações": "🔥 ✨ 💫 ⚡ 💥 💯 ✅ ☑ ✔ ❌ ❎ ⚠ 🚀 🧠 👀 🙌 👏 🤝 💪 🫡 🤌 🤙 🫵 🫶",
  "Natureza": "☀ ☁ ☂ ☔ ❄ ⛄ ⚡ 🌙 🌚 🌝 🌞 🪐 ⭐ 🌈 🌊 🔥 💧 🌪 🌎 🌍 🌌 ☄ 🌋 🏔",
  "Objetos": "⌘ ⌬ ⌲ ⌁ ⌑ ⌖ ⌗ ⌛ ⏳ ⏱ ⏰ ⏭ ⏮ ⏯ ⏸ ⏹ 🔒 🔓 🔑 💎 🧿 🪬 📌 📍",
  "Separadores": "• · ･ 。 ・ | ❘ ❙ ❚ ┃ │ ┆ ┊ ─ ━ ═ ║ ╬ ═ ❖ ◆ ◇ ◈ ▬ ▭ ▰ ▱",
  "Emoticons": "^_^ -_- >_< o_O O_o T_T :D :) :( ;) :P :3 <3 </3 :v :') :| :0 XD xD UwU OwO",
  "Japoneses": "あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の ア イ ウ エ オ カ キ ク ケ コ",
  "Aesthetic": "୨୧ 𓍯 𓂃 𓈒 𓏸 𓆩𓆪 𓇼 𓋼 𓍼 𓊆𓊇 𝜗𝜚 ᵕ̈ ʚɞ ໒꒱ ꒰꒱ ☁︎ ☾ ⋆ ˚｡",
  "Dark": "⛧ ☠ ☽ ☾ ⛓ ⚰ 🕷 🕸 🗡 ♱ ♰ ✞ ✟ 𖤐 𖤍 𖣔 𖠌 𖦹 𝖝 𝖔",
  "Luxo": "♛ ♕ ♔ ♚ ✦ ✧ ✨ 💎 🜲 ⚜ ❖ ◈ 𓆩𓆪 𓂀 𓃭 𓊝 𓇼 𓋹 𓏲",
  "Roblox": "🧱 🎮 🕹 👾 ⚔ 🛡 🧢 ⭐ 💎 🔥 ⚡ 🏆 xX Xx _z _br playz blox robux noob pro",
  "Mandarim": "字 文 名 王 帝 龍 龙 虎 神 影 光 星 月 火 水 風 风 山 天 空 夜 忍 戦 战 愛 爱 夢 梦",
  "Coreano": "한 글 민 준 서 지 유 하 도 윤 별 빛 달 검 흑 백 왕 신 용 불 물 바 람 밤 꿈 사랑",
  "Japonês": "神 忍 侍 龍 桜 星 月 火 水 風 山 空 夜 光 影 愛 夢 東京 大 阪 心 刀 王 姫 天"
};

const nickPatterns = [
  name => `꧁${name}꧂`,
  name => `么${name}亗`,
  name => `♛${name}♛`,
  name => `『${name}』`,
  name => `✦${name}✦`,
  name => `${name}ツ`,
  name => `${name} FF`,
  name => `YT ${name}`,
  name => `TTV ${name}`,
  name => `${name}ᶠᶠ`,
  name => `ᴳᵒᵈ ${name}`,
  name => `ᴾᴿᴼ ${name}`,
  name => `x${name}x`,
  name => `Sr.${name}`,
  name => `DARK ${name}`,
  name => `Nøva ${name}`,
  name => `Lenda ${name}`,
  name => `ꜱᴋʏ ${name}`,
  name => convert(name, maps.boldFraktur),
  name => convert(name, maps.smallCaps),
  name => convert(name, maps.double),
  name => convert(name, maps.squared),
  name => `𓆩${name}𓆪`,
  name => `☯ ${name} ☯`,
  name => `⚡${name}⚡`,
  name => `☠ ${name} ☠`,
  name => `彡${name}彡`,
  name => `〆${name}〆`,
  name => `༺${name}༻`,
  name => `⫷${name}⫸`,
  name => `${normalizeNick(name)}prime`,
  name => `${normalizeNick(name)}verse`,
  name => `${normalizeNick(name)}rush`,
  name => `${normalizeNick(name)}zone`,
  name => `${normalizeNick(name)}wave`,
  name => `${normalizeNick(name)}x`,
  name => `real${capitalize(normalizeNick(name))}`,
  name => `use${capitalize(normalizeNick(name))}`,
  name => `its${capitalize(normalizeNick(name))}`,
  name => `hey${capitalize(normalizeNick(name))}`,
  name => `${normalizeNick(name)}br`,
  name => `${normalizeNick(name)}play`,
  name => `${normalizeNick(name)}clips`,
  name => `${normalizeNick(name)}tv`,
  name => `${normalizeNick(name)}gg`,
  name => `not${capitalize(normalizeNick(name))}`,
  name => `${normalizeNick(name)}lab`,
  name => `${normalizeNick(name)}hub`,
  name => `王${name}龍`,
  name => `한${name}빛`,
  name => `神${name}忍`
];

const robloxPatterns = [
  name => `${name}prime`,
  name => `${name}zbr`,
  name => `${name}blox`,
  name => `${name}playz`,
  name => `${name}verse`,
  name => `${name}craft`,
  name => `${name}rush`,
  name => `${name}zone`,
  name => `${name}wave`,
  name => `${name}prime`,
  name => `${name}nova`,
  name => `${name}byte`,
  name => `${name}quest`,
  name => `${name}builds`,
  name => `${name}clips`,
  name => `${name}studio`,
  name => `${name}hub`,
  name => `${name}lab`,
  name => `${name}gg`,
  name => `${name}br`,
  name => `${name}x`,
  name => `real${name}`,
  name => `its${name}`,
  name => `hey${name}`,
  name => `use${name}`,
  name => `not${name}`,
  name => `blox${name}`,
  name => `zap${name}`,
  name => `play${name}`,
  name => `rbx${name}`,
  name => `${name}_${numberSeed(name)}`,
  name => `${name}${numberSeed(name)}`,
  name => `${name}${numberSeed(name) + 17}`,
  name => `${name}${new Date().getFullYear().toString().slice(2)}`,
  name => `${name}on`,
  name => `${name}up`,
  name => `${name}go`,
  name => `${name}hq`,
  name => `${name}vr`,
  name => `x${name}z`
];

const elements = {
  input: document.querySelector("#mainInput"),
  results: document.querySelector("#results"),
  counter: document.querySelector("#charCounter"),
  copyAll: document.querySelector("#copyAllButton"),
  share: document.querySelector("#shareButton"),
  toast: document.querySelector("#toast"),
  theme: document.querySelector("#themeToggle"),
  backToTop: document.querySelector("#backToTop"),
  symbolTabs: document.querySelector("#symbolTabs"),
  symbolSearch: document.querySelector("#symbolSearch"),
  symbolsGrid: document.querySelector("#symbolsGrid"),
  nickInput: document.querySelector("#nickInput"),
  nickResults: document.querySelector("#nickResults"),
  robloxInput: document.querySelector("#robloxInput"),
  robloxResults: document.querySelector("#robloxResults"),
  filterButtons: document.querySelectorAll(".filter-button"),
  historyList: document.querySelector("#historyList"),
  clearHistory: document.querySelector("#clearHistoryButton"),
  navToggle: document.querySelector(".nav-toggle"),
  navLinks: document.querySelector(".nav-links"),
  year: document.querySelector("#year")
};

init();

function init() {
  elements.year.textContent = new Date().getFullYear();
  elements.input.value = localStorage.getItem("fontvibe:lastText") || "";
  elements.nickInput.value = localStorage.getItem("fontvibe:lastNick") || "";
  elements.robloxInput.value = localStorage.getItem("fontvibe:lastRoblox") || "";
  applySavedTheme();
  renderResults();
  renderSymbols(activeSymbolCategory);
  renderNicknames();
  renderRobloxNicknames();
  renderHistory();
  bindEvents();
}

function bindEvents() {
  elements.input.addEventListener("input", () => {
    localStorage.setItem("fontvibe:lastText", elements.input.value);
    renderResults();
    saveHistory(elements.input.value.trim());
  });

  elements.nickInput.addEventListener("input", () => {
    localStorage.setItem("fontvibe:lastNick", elements.nickInput.value);
    renderNicknames();
  });

  elements.robloxInput.addEventListener("input", () => {
    localStorage.setItem("fontvibe:lastRoblox", elements.robloxInput.value);
    renderRobloxNicknames();
  });

  elements.symbolSearch.addEventListener("input", () => renderSymbols(activeSymbolCategory));

  elements.filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeStyleFilter = button.dataset.filter;
      elements.filterButtons.forEach(item => item.classList.toggle("active", item === button));
      renderResults();
    });
  });

  elements.copyAll.addEventListener("click", () => {
    const text = getCurrentText();
    const allResults = styles.map(([name, fn]) => `${name}: ${fn(text)}`).join("\n");
    copyText(allResults);
  });

  elements.share.addEventListener("click", shareResult);
  elements.theme.addEventListener("click", toggleTheme);
  elements.clearHistory.addEventListener("click", clearHistory);
  elements.backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  elements.navToggle.addEventListener("click", toggleMenu);
  elements.navLinks.addEventListener("click", event => {
    if (event.target.matches("a")) closeMenu();
  });

  window.addEventListener("scroll", () => {
    elements.backToTop.classList.toggle("visible", window.scrollY > 520);
  }, { passive: true });
}

function renderResults() {
  const text = getCurrentText();
  const favorites = getFavorites();
  elements.counter.textContent = `${elements.input.value.length}/280 caracteres`;
  elements.results.innerHTML = "";
  const fragment = document.createDocumentFragment();

  styles.forEach(([name, formatter]) => {
    const category = getStyleCategory(name);
    if (activeStyleFilter === "Favoritos" && !favorites.includes(name)) return;
    if (activeStyleFilter !== "Todos" && activeStyleFilter !== "Favoritos" && category !== activeStyleFilter) return;

    const converted = formatter(text);
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-topline">
        <h3>${escapeHtml(name)} · ${escapeHtml(category)}</h3>
        <button class="favorite-button${favorites.includes(name) ? " active" : ""}" type="button" aria-label="Favoritar ${escapeHtml(name)}" title="Favoritar">★</button>
      </div>
      <div class="result-text">${escapeHtml(converted)}</div>
      <button type="button">Copiar</button>
    `;
    const favoriteButton = card.querySelector(".favorite-button");
    favoriteButton.addEventListener("click", () => {
      toggleFavorite(name);
      renderResults();
    });
    card.querySelector(".result-card > button").addEventListener("click", () => copyText(converted));
    fragment.appendChild(card);
  });

  if (!fragment.childNodes.length) {
    const empty = document.createElement("article");
    empty.className = "result-card";
    empty.innerHTML = "<h3>Nenhum resultado</h3><div class=\"result-text\">Favorite algumas fontes ou escolha outro filtro.</div>";
    fragment.appendChild(empty);
  }

  elements.results.appendChild(fragment);
}

function renderSymbols(activeCategory) {
  activeSymbolCategory = activeCategory;
  const search = normalizeSearch(elements.symbolSearch.value);
  elements.symbolTabs.innerHTML = "";
  Object.keys(symbolCategories).forEach(category => {
    const button = document.createElement("button");
    button.className = `symbol-tab${category === activeCategory ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => renderSymbols(category));
    elements.symbolTabs.appendChild(button);
  });

  elements.symbolsGrid.innerHTML = "";
  let symbols = symbolCategories[activeCategory].split(/\s+/).filter(Boolean);

  if (search) {
    symbols = Object.entries(symbolCategories)
      .filter(([category, content]) => normalizeSearch(`${category} ${content}`).includes(search))
      .flatMap(([, content]) => content.split(/\s+/).filter(Boolean));
  }

  [...new Set(symbols)].forEach(symbol => {
    const button = document.createElement("button");
    button.className = "symbol-button";
    button.type = "button";
    button.textContent = symbol;
    button.title = `Copiar ${symbol}`;
    button.addEventListener("click", () => copyText(symbol));
    elements.symbolsGrid.appendChild(button);
  });
}

function renderNicknames() {
  const name = elements.nickInput.value.trim() || "Player";
  elements.nickResults.innerHTML = "";
  nickPatterns.forEach(pattern => {
    const nick = pattern(name);
    const item = document.createElement("div");
    item.className = "nick-item";
    item.innerHTML = `<span>${escapeHtml(nick)}</span><button type="button">Copiar</button>`;
    item.querySelector("button").addEventListener("click", () => copyText(nick));
    elements.nickResults.appendChild(item);
  });
}

function renderRobloxNicknames() {
  const rawName = elements.robloxInput.value.trim() || elements.nickInput.value.trim() || "player";
  const name = normalizeNick(rawName).slice(0, 14) || "player";
  elements.robloxResults.innerHTML = "";

  const nicks = [...new Set(robloxPatterns.map(pattern => pattern(name).slice(0, 20)))];
  nicks.forEach(nick => {
    const item = document.createElement("div");
    item.className = "nick-item";
    item.innerHTML = `<span>${escapeHtml(nick)}</span><button type="button">Copiar</button>`;
    item.querySelector("button").addEventListener("click", () => copyText(nick));
    elements.robloxResults.appendChild(item);
  });
}

function renderHistory() {
  const history = getHistory();
  elements.historyList.innerHTML = "";

  if (!history.length) {
    elements.historyList.innerHTML = "<p>Nenhum texto recente ainda.</p>";
    return;
  }

  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `<span>${escapeHtml(item)}</span><button type="button">Usar</button>`;
    row.querySelector("button").addEventListener("click", () => {
      elements.input.value = item;
      localStorage.setItem("fontvibe:lastText", item);
      renderResults();
      window.location.hash = "#gerador";
    });
    elements.historyList.appendChild(row);
  });
}

function saveHistory(value) {
  if (!value || value.length < 2) return;
  const history = getHistory().filter(item => item !== value);
  history.unshift(value);
  localStorage.setItem("fontvibe:history", JSON.stringify(history.slice(0, maxHistoryItems)));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem("fontvibe:history");
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("fontvibe:history") || "[]");
  } catch {
    return [];
  }
}

function getCurrentText() {
  return elements.input.value.trim() || sampleText;
}

function getStyleCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("instagram") || lower.includes("insta") || lower.includes("bio")) return "Instagram";
  if (lower.includes("tiktok")) return "TikTok";
  if (lower.includes("free fire") || lower.includes("ff ")) return "Free Fire";
  if (lower.includes("gamer") || lower.includes("game") || lower.includes("clã") || lower.includes("roblox") || lower.includes("hacker") || lower.includes("matrix") || lower.includes("streamer") || lower.includes("pixel") || lower.includes("arcade")) return "Gamer";
  if (lower.includes("aesthetic") || lower.includes("soft") || lower.includes("cute") || lower.includes("kawaii") || lower.includes("princess") || lower.includes("angel") || lower.includes("y2k")) return "Aesthetic";
  if (lower.includes("dark") || lower.includes("gótico") || lower.includes("skull") || lower.includes("devil") || lower.includes("shadow") || lower.includes("glitch")) return "Dark";
  if (lower.includes("lux") || lower.includes("royal") || lower.includes("crown") || lower.includes("gold") || lower.includes("diamond") || lower.includes("vip") || lower.includes("elite")) return "Luxo";
  return "Todos";
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("fontvibe:favorites") || "[]");
  } catch {
    return [];
  }
}

function toggleFavorite(name) {
  const favorites = getFavorites();
  const next = favorites.includes(name)
    ? favorites.filter(item => item !== name)
    : [...favorites, name];
  localStorage.setItem("fontvibe:favorites", JSON.stringify(next));
}

function normalizeSearch(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizeNick(value) {
  const clean = String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return clean || "player";
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function numberSeed(value) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 90 + 10;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copiado com sucesso");
  } catch {
    fallbackCopy(text);
    showToast("Copiado com sucesso");
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function shareResult() {
  const text = getCurrentText();
  const shareText = styles.slice(0, 8).map(([name, fn]) => `${name}: ${fn(text)}`).join("\n");
  if (navigator.share) {
    try {
      await navigator.share({ title: "FontVibe", text: shareText });
      return;
    } catch {
      return;
    }
  }
  copyText(shareText);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function toggleTheme() {
  document.documentElement.classList.toggle("light");
  const theme = document.documentElement.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("fontvibe:theme", theme);
}

function applySavedTheme() {
  const saved = localStorage.getItem("fontvibe:theme");
  if (saved === "light") document.documentElement.classList.add("light");
}

function toggleMenu() {
  const isOpen = elements.navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  elements.navToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  elements.navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  elements.navToggle.setAttribute("aria-expanded", "false");
}

function createMap(upperStart, lowerStart, digitStart, overrides = {}) {
  const map = { ...overrides };
  for (let i = 0; i < 26; i += 1) {
    map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
    map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
  }
  if (digitStart) {
    for (let i = 0; i < 10; i += 1) map[String(i)] = String.fromCodePoint(digitStart + i);
  }
  return map;
}

function createFullwidthMap() {
  const map = { " ": "　" };
  for (let i = 33; i <= 126; i += 1) map[String.fromCharCode(i)] = String.fromCodePoint(i + 0xfee0);
  return map;
}

function createRangeMap(source, target) {
  const map = {};
  const targetChars = Array.from(target);
  Array.from(source).forEach((char, index) => {
    if (targetChars[index]) map[char] = targetChars[index];
  });
  return map;
}

function convert(text, map) {
  return Array.from(text).map(char => map[char] || map[char.toLowerCase()] || char).join("");
}

function decorate(text, before, after) {
  return `${before} ${text} ${after}`;
}

function spaced(text, spacer) {
  return Array.from(text).join(spacer);
}

function reverse(text) {
  return Array.from(text).reverse().join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
