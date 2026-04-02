// Mock question pool cho tính năng Luyện tập AI.
// Dữ liệu tĩnh, dùng tạm trước khi tích hợp API thật.

import type { PracticeQuestion, SessionType } from "./practice-with-ai.types";

const VOCABULARY_QUESTIONS: PracticeQuestion[] = [
  {
    id: "v1",
    type: "multiple_choice",
    text: "Từ nào có nghĩa là 'tôi' trong tiếng Nhật?",
    hint: "Đây là đại từ nhân xưng ngôi thứ nhất phổ biến nhất.",
    options: [
      { id: "v1a", label: "A", text: "わたし", isCorrect: true },
      { id: "v1b", label: "B", text: "あなた", isCorrect: false },
      { id: "v1c", label: "C", text: "かれ", isCorrect: false },
      { id: "v1d", label: "D", text: "かのじょ", isCorrect: false },
    ],
  },
  {
    id: "v2",
    type: "multiple_choice",
    text: "「ありがとう」có nghĩa là gì?",
    hint: "Đây là câu nói dùng để bày tỏ lòng biết ơn.",
    options: [
      { id: "v2a", label: "A", text: "Xin lỗi", isCorrect: false },
      { id: "v2b", label: "B", text: "Cảm ơn", isCorrect: true },
      { id: "v2c", label: "C", text: "Xin chào", isCorrect: false },
      { id: "v2d", label: "D", text: "Tạm biệt", isCorrect: false },
    ],
  },
  {
    id: "v3",
    type: "multiple_choice",
    text: "「水」đọc là gì và có nghĩa là gì?",
    hint: "Đây là thứ bạn uống mỗi ngày.",
    options: [
      { id: "v3a", label: "A", text: "ひ — lửa", isCorrect: false },
      { id: "v3b", label: "B", text: "き — cây", isCorrect: false },
      { id: "v3c", label: "C", text: "みず — nước", isCorrect: true },
      { id: "v3d", label: "D", text: "つち — đất", isCorrect: false },
    ],
  },
  {
    id: "v4",
    type: "multiple_choice",
    text: "Từ nào có nghĩa là 'sách'?",
    options: [
      { id: "v4a", label: "A", text: "えんぴつ", isCorrect: false },
      { id: "v4b", label: "B", text: "つくえ", isCorrect: false },
      { id: "v4c", label: "C", text: "いす", isCorrect: false },
      { id: "v4d", label: "D", text: "ほん", isCorrect: true },
    ],
  },
  {
    id: "v5",
    type: "multiple_choice",
    text: "「食べる」có nghĩa là gì?",
    hint: "Hành động bạn làm với thức ăn.",
    options: [
      { id: "v5a", label: "A", text: "Uống", isCorrect: false },
      { id: "v5b", label: "B", text: "Ăn", isCorrect: true },
      { id: "v5c", label: "C", text: "Ngủ", isCorrect: false },
      { id: "v5d", label: "D", text: "Chạy", isCorrect: false },
    ],
  },
  {
    id: "v6",
    type: "multiple_choice",
    text: "「大きい」nghĩa là gì?",
    options: [
      { id: "v6a", label: "A", text: "Nhỏ", isCorrect: false },
      { id: "v6b", label: "B", text: "Nhanh", isCorrect: false },
      { id: "v6c", label: "C", text: "To, lớn", isCorrect: true },
      { id: "v6d", label: "D", text: "Đẹp", isCorrect: false },
    ],
  },
  {
    id: "v7",
    type: "multiple_choice",
    text: "Từ nào có nghĩa là 'học trường'?",
    hint: "Nơi học sinh đến học mỗi ngày.",
    options: [
      { id: "v7a", label: "A", text: "びょういん", isCorrect: false },
      { id: "v7b", label: "B", text: "がっこう", isCorrect: true },
      { id: "v7c", label: "C", text: "ゆうびんきょく", isCorrect: false },
      { id: "v7d", label: "D", text: "えき", isCorrect: false },
    ],
  },
  {
    id: "v8",
    type: "multiple_choice",
    text: "「赤い」có nghĩa là gì?",
    options: [
      { id: "v8a", label: "A", text: "Xanh lá", isCorrect: false },
      { id: "v8b", label: "B", text: "Vàng", isCorrect: false },
      { id: "v8c", label: "C", text: "Trắng", isCorrect: false },
      { id: "v8d", label: "D", text: "Đỏ", isCorrect: true },
    ],
  },
  {
    id: "v9",
    type: "multiple_choice",
    text: "Từ nào có nghĩa là 'điện thoại'?",
    options: [
      { id: "v9a", label: "A", text: "テレビ", isCorrect: false },
      { id: "v9b", label: "B", text: "ラジオ", isCorrect: false },
      { id: "v9c", label: "C", text: "でんわ", isCorrect: true },
      { id: "v9d", label: "D", text: "パソコン", isCorrect: false },
    ],
  },
  {
    id: "v10",
    type: "multiple_choice",
    text: "「毎日」có nghĩa là gì?",
    hint: "Liên quan đến tần suất thời gian.",
    options: [
      { id: "v10a", label: "A", text: "Hôm qua", isCorrect: false },
      { id: "v10b", label: "B", text: "Mỗi ngày", isCorrect: true },
      { id: "v10c", label: "C", text: "Ngày mai", isCorrect: false },
      { id: "v10d", label: "D", text: "Tuần trước", isCorrect: false },
    ],
  },
];

const GRAMMAR_QUESTIONS: PracticeQuestion[] = [
  {
    id: "g1",
    type: "multiple_choice",
    text: "Chọn câu đúng: 'Tôi là sinh viên'",
    hint: "Dùng trợ từ 「は」để đánh dấu chủ ngữ.",
    options: [
      { id: "g1a", label: "A", text: "わたしが がくせい です", isCorrect: false },
      { id: "g1b", label: "B", text: "わたしは がくせい です", isCorrect: true },
      { id: "g1c", label: "C", text: "わたしを がくせい です", isCorrect: false },
      { id: "g1d", label: "D", text: "わたしに がくせい です", isCorrect: false },
    ],
  },
  {
    id: "g2",
    type: "multiple_choice",
    text: "Trợ từ nào dùng để chỉ nơi chốn hoạt động diễn ra?",
    hint: "Trợ từ này đi sau danh từ chỉ địa điểm.",
    options: [
      { id: "g2a", label: "A", text: "に", isCorrect: false },
      { id: "g2b", label: "B", text: "を", isCorrect: false },
      { id: "g2c", label: "C", text: "で", isCorrect: true },
      { id: "g2d", label: "D", text: "が", isCorrect: false },
    ],
  },
  {
    id: "g3",
    type: "multiple_choice",
    text: "「学校に行きます」có nghĩa là gì?",
    options: [
      { id: "g3a", label: "A", text: "Tôi học ở trường", isCorrect: false },
      { id: "g3b", label: "B", text: "Tôi về trường", isCorrect: false },
      { id: "g3c", label: "C", text: "Tôi đi đến trường", isCorrect: true },
      { id: "g3d", label: "D", text: "Tôi ở gần trường", isCorrect: false },
    ],
  },
  {
    id: "g4",
    type: "multiple_choice",
    text: "Đâu là dạng phủ định của「食べます」?",
    hint: "Dạng phủ định lịch sự kết thúc bằng 〜ません.",
    options: [
      { id: "g4a", label: "A", text: "食べません", isCorrect: true },
      { id: "g4b", label: "B", text: "食べないです", isCorrect: false },
      { id: "g4c", label: "C", text: "食べじゃない", isCorrect: false },
      { id: "g4d", label: "D", text: "食べではない", isCorrect: false },
    ],
  },
  {
    id: "g5",
    type: "multiple_choice",
    text: "Câu hỏi「これは何ですか」có nghĩa là gì?",
    options: [
      { id: "g5a", label: "A", text: "Đây là cái gì?", isCorrect: true },
      { id: "g5b", label: "B", text: "Đây ở đâu?", isCorrect: false },
      { id: "g5c", label: "C", text: "Đây của ai?", isCorrect: false },
      { id: "g5d", label: "D", text: "Đây có bao nhiêu?", isCorrect: false },
    ],
  },
  {
    id: "g6",
    type: "multiple_choice",
    text: "Trợ từ nào dùng để chỉ đối tượng của động từ?",
    options: [
      { id: "g6a", label: "A", text: "は", isCorrect: false },
      { id: "g6b", label: "B", text: "が", isCorrect: false },
      { id: "g6c", label: "C", text: "に", isCorrect: false },
      { id: "g6d", label: "D", text: "を", isCorrect: true },
    ],
  },
  {
    id: "g7",
    type: "multiple_choice",
    text: "「〜たい」dùng để diễn đạt điều gì?",
    hint: "Đây là cấu trúc bày tỏ mong muốn của người nói.",
    options: [
      { id: "g7a", label: "A", text: "Khả năng", isCorrect: false },
      { id: "g7b", label: "B", text: "Mong muốn", isCorrect: true },
      { id: "g7c", label: "C", text: "Đề nghị", isCorrect: false },
      { id: "g7d", label: "D", text: "Bắt buộc", isCorrect: false },
    ],
  },
  {
    id: "g8",
    type: "multiple_choice",
    text: "Dạng quá khứ lịch sự của「見ます」là gì?",
    options: [
      { id: "g8a", label: "A", text: "見ました", isCorrect: true },
      { id: "g8b", label: "B", text: "見てました", isCorrect: false },
      { id: "g8c", label: "C", text: "見だった", isCorrect: false },
      { id: "g8d", label: "D", text: "見でした", isCorrect: false },
    ],
  },
  {
    id: "g9",
    type: "multiple_choice",
    text: "「〜てください」dùng để làm gì?",
    hint: "Cấu trúc này thường xuất hiện khi yêu cầu ai đó.",
    options: [
      { id: "g9a", label: "A", text: "Hỏi thông tin", isCorrect: false },
      { id: "g9b", label: "B", text: "Đưa ra yêu cầu/đề nghị", isCorrect: true },
      { id: "g9c", label: "C", text: "Phủ định hành động", isCorrect: false },
      { id: "g9d", label: "D", text: "Diễn tả khả năng", isCorrect: false },
    ],
  },
  {
    id: "g10",
    type: "multiple_choice",
    text: "Đâu là câu đúng nghĩa 'Tôi không hiểu tiếng Nhật'?",
    options: [
      { id: "g10a", label: "A", text: "にほんごがわかります", isCorrect: false },
      { id: "g10b", label: "B", text: "にほんごをわかりません", isCorrect: false },
      { id: "g10c", label: "C", text: "にほんごがわかりません", isCorrect: true },
      { id: "g10d", label: "D", text: "にほんごはわかります", isCorrect: false },
    ],
  },
];

const KANJI_QUESTIONS: PracticeQuestion[] = [
  {
    id: "k1",
    type: "multiple_choice",
    text: "「日」có âm On'yomi là gì?",
    hint: "Chữ này có nghĩa là 'mặt trời' hoặc 'ngày'.",
    options: [
      { id: "k1a", label: "A", text: "ひ", isCorrect: false },
      { id: "k1b", label: "B", text: "にち / じつ", isCorrect: true },
      { id: "k1c", label: "C", text: "つき", isCorrect: false },
      { id: "k1d", label: "D", text: "ほし", isCorrect: false },
    ],
  },
  {
    id: "k2",
    type: "multiple_choice",
    text: "「山」đọc theo Kun'yomi là gì?",
    options: [
      { id: "k2a", label: "A", text: "さん", isCorrect: false },
      { id: "k2b", label: "B", text: "かわ", isCorrect: false },
      { id: "k2c", label: "C", text: "やま", isCorrect: true },
      { id: "k2d", label: "D", text: "もり", isCorrect: false },
    ],
  },
  {
    id: "k3",
    type: "multiple_choice",
    text: "Kanji nào có nghĩa là 'con người'?",
    options: [
      { id: "k3a", label: "A", text: "大", isCorrect: false },
      { id: "k3b", label: "B", text: "人", isCorrect: true },
      { id: "k3c", label: "C", text: "子", isCorrect: false },
      { id: "k3d", label: "D", text: "女", isCorrect: false },
    ],
  },
  {
    id: "k4",
    type: "multiple_choice",
    text: "「月」trong từ「月曜日」có nghĩa là gì?",
    hint: "Đây là tên của một ngày trong tuần.",
    options: [
      { id: "k4a", label: "A", text: "Mặt trời", isCorrect: false },
      { id: "k4b", label: "B", text: "Ngôi sao", isCorrect: false },
      { id: "k4c", label: "C", text: "Mặt trăng", isCorrect: true },
      { id: "k4d", label: "D", text: "Lửa", isCorrect: false },
    ],
  },
  {
    id: "k5",
    type: "multiple_choice",
    text: "「学」có nghĩa chính là gì?",
    options: [
      { id: "k5a", label: "A", text: "Dạy", isCorrect: false },
      { id: "k5b", label: "B", text: "Học", isCorrect: true },
      { id: "k5c", label: "C", text: "Viết", isCorrect: false },
      { id: "k5d", label: "D", text: "Đọc", isCorrect: false },
    ],
  },
  {
    id: "k6",
    type: "multiple_choice",
    text: "「電」trong từ「電車」có nghĩa là gì?",
    hint: "Nghĩa liên quan đến năng lượng.",
    options: [
      { id: "k6a", label: "A", text: "Xe", isCorrect: false },
      { id: "k6b", label: "B", text: "Điện", isCorrect: true },
      { id: "k6c", label: "C", text: "Đường", isCorrect: false },
      { id: "k6d", label: "D", text: "Tàu", isCorrect: false },
    ],
  },
  {
    id: "k7",
    type: "multiple_choice",
    text: "Kanji nào có nghĩa là 'to, lớn'?",
    options: [
      { id: "k7a", label: "A", text: "小", isCorrect: false },
      { id: "k7b", label: "B", text: "中", isCorrect: false },
      { id: "k7c", label: "C", text: "大", isCorrect: true },
      { id: "k7d", label: "D", text: "上", isCorrect: false },
    ],
  },
  {
    id: "k8",
    type: "multiple_choice",
    text: "「語」thường gặp trong từ nào sau đây?",
    options: [
      { id: "k8a", label: "A", text: "日本語", isCorrect: true },
      { id: "k8b", label: "B", text: "日本人", isCorrect: false },
      { id: "k8c", label: "C", text: "日本食", isCorrect: false },
      { id: "k8d", label: "D", text: "日本酒", isCorrect: false },
    ],
  },
  {
    id: "k9",
    type: "multiple_choice",
    text: "「右」và「左」có nghĩa là gì?",
    hint: "Đây là hai hướng đối lập nhau.",
    options: [
      { id: "k9a", label: "A", text: "Trên và dưới", isCorrect: false },
      { id: "k9b", label: "B", text: "Trước và sau", isCorrect: false },
      { id: "k9c", label: "C", text: "Phải và trái", isCorrect: true },
      { id: "k9d", label: "D", text: "Trong và ngoài", isCorrect: false },
    ],
  },
  {
    id: "k10",
    type: "multiple_choice",
    text: "「本」có hai nghĩa phổ biến là gì?",
    options: [
      { id: "k10a", label: "A", text: "Bút và giấy", isCorrect: false },
      { id: "k10b", label: "B", text: "Sách và nguồn gốc/Nhật Bản", isCorrect: true },
      { id: "k10c", label: "C", text: "Ngày và đêm", isCorrect: false },
      { id: "k10d", label: "D", text: "Học và dạy", isCorrect: false },
    ],
  },
];

const SENTENCE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "s1",
    type: "multiple_choice",
    text: "Sắp xếp nào đúng để tạo câu 'Tôi uống cà phê mỗi sáng'?",
    hint: "Tiếng Nhật theo cấu trúc Chủ-Tân-Vị (SOV).",
    options: [
      { id: "s1a", label: "A", text: "まいあさ　わたしは　コーヒーを　のみます", isCorrect: true },
      { id: "s1b", label: "B", text: "わたしは　のみます　コーヒーを　まいあさ", isCorrect: false },
      { id: "s1c", label: "C", text: "コーヒーを　まいあさ　のみます　わたしは", isCorrect: false },
      { id: "s1d", label: "D", text: "のみます　わたしは　まいあさ　コーヒーを", isCorrect: false },
    ],
  },
  {
    id: "s2",
    type: "multiple_choice",
    text: "Câu nào đúng nghĩa 'Hôm nay trời đẹp'?",
    options: [
      { id: "s2a", label: "A", text: "きょうはてんきがわるいです", isCorrect: false },
      { id: "s2b", label: "B", text: "きょうはいいてんきです", isCorrect: true },
      { id: "s2c", label: "C", text: "きのうはいいてんきです", isCorrect: false },
      { id: "s2d", label: "D", text: "あしたはいいてんきです", isCorrect: false },
    ],
  },
  {
    id: "s3",
    type: "multiple_choice",
    text: "Câu nào diễn đạt đúng 'Tôi muốn đi Nhật Bản'?",
    hint: "Dùng cấu trúc 〜たい để bày tỏ mong muốn.",
    options: [
      { id: "s3a", label: "A", text: "にほんへいきます", isCorrect: false },
      { id: "s3b", label: "B", text: "にほんへいきたいです", isCorrect: true },
      { id: "s3c", label: "C", text: "にほんへいってください", isCorrect: false },
      { id: "s3d", label: "D", text: "にほんへいきましょう", isCorrect: false },
    ],
  },
  {
    id: "s4",
    type: "multiple_choice",
    text: "Đâu là câu đúng nghĩa 'Cô ấy xinh đẹp phải không?'",
    options: [
      { id: "s4a", label: "A", text: "かのじょはきれいですね", isCorrect: true },
      { id: "s4b", label: "B", text: "かのじょはきれいですよ", isCorrect: false },
      { id: "s4c", label: "C", text: "かのじょはきれいですか", isCorrect: false },
      { id: "s4d", label: "D", text: "かのじょはきれいですよね", isCorrect: false },
    ],
  },
  {
    id: "s5",
    type: "multiple_choice",
    text: "Câu 'Tôi đã xem phim tối qua' dịch sang tiếng Nhật là?",
    hint: "Dùng dạng quá khứ lịch sự 〜ました.",
    options: [
      { id: "s5a", label: "A", text: "きのうのよる　えいがをみます", isCorrect: false },
      { id: "s5b", label: "B", text: "きのうのよる　えいがをみました", isCorrect: true },
      { id: "s5c", label: "C", text: "きのうのよる　えいがをみたい", isCorrect: false },
      { id: "s5d", label: "D", text: "きのうのよる　えいがをみましょう", isCorrect: false },
    ],
  },
  {
    id: "s6",
    type: "multiple_choice",
    text: "Câu hỏi nào đúng nghĩa 'Bạn đang làm gì vậy?'",
    options: [
      { id: "s6a", label: "A", text: "なにをしていますか", isCorrect: true },
      { id: "s6b", label: "B", text: "なにをしましたか", isCorrect: false },
      { id: "s6c", label: "C", text: "なにをしますか", isCorrect: false },
      { id: "s6d", label: "D", text: "なにをしたいですか", isCorrect: false },
    ],
  },
  {
    id: "s7",
    type: "multiple_choice",
    text: "Câu nào đúng nghĩa 'Xin hãy nói chậm hơn'?",
    hint: "Dùng 〜てください để đề nghị.",
    options: [
      { id: "s7a", label: "A", text: "もっとゆっくりはなします", isCorrect: false },
      { id: "s7b", label: "B", text: "もっとゆっくりはなしてください", isCorrect: true },
      { id: "s7c", label: "C", text: "もっとゆっくりはなしましょう", isCorrect: false },
      { id: "s7d", label: "D", text: "もっとゆっくりはなしたいです", isCorrect: false },
    ],
  },
  {
    id: "s8",
    type: "multiple_choice",
    text: "Đâu là cách đúng để nói 'Tôi không thích rau'?",
    options: [
      { id: "s8a", label: "A", text: "やさいがすきです", isCorrect: false },
      { id: "s8b", label: "B", text: "やさいがすきではありません", isCorrect: true },
      { id: "s8c", label: "C", text: "やさいをすきません", isCorrect: false },
      { id: "s8d", label: "D", text: "やさいはすきないです", isCorrect: false },
    ],
  },
  {
    id: "s9",
    type: "multiple_choice",
    text: "Câu nào đúng nghĩa 'Tôi đã sinh ra ở Việt Nam'?",
    hint: "Dùng trợ từ 「で」chỉ nơi chốn và dạng quá khứ.",
    options: [
      { id: "s9a", label: "A", text: "ベトナムにうまれました", isCorrect: false },
      { id: "s9b", label: "B", text: "ベトナムでうまれました", isCorrect: true },
      { id: "s9c", label: "C", text: "ベトナムをうまれました", isCorrect: false },
      { id: "s9d", label: "D", text: "ベトナムはうまれました", isCorrect: false },
    ],
  },
  {
    id: "s10",
    type: "multiple_choice",
    text: "Câu nào diễn đạt đúng 'Nếu trời mưa thì tôi sẽ ở nhà'?",
    hint: "Dùng cấu trúc 〜たら để diễn đạt điều kiện.",
    options: [
      { id: "s10a", label: "A", text: "あめがふったら、いえにいます", isCorrect: true },
      { id: "s10b", label: "B", text: "あめがふれば、いえにいます", isCorrect: false },
      { id: "s10c", label: "C", text: "あめがふると、いえにいます", isCorrect: false },
      { id: "s10d", label: "D", text: "あめがふって、いえにいます", isCorrect: false },
    ],
  },
];

const COMBINED_QUESTIONS: PracticeQuestion[] = [
  ...VOCABULARY_QUESTIONS.slice(0, 4),
  ...GRAMMAR_QUESTIONS.slice(0, 3),
  ...KANJI_QUESTIONS.slice(0, 3),
];

const QUESTION_POOL: Record<SessionType, PracticeQuestion[]> = {
  vocabulary: VOCABULARY_QUESTIONS,
  grammar: GRAMMAR_QUESTIONS,
  kanji: KANJI_QUESTIONS,
  sentence: SENTENCE_QUESTIONS,
  combined: COMBINED_QUESTIONS,
};

export function generateMockQuestions(
  sessionType: SessionType,
  count: number,
): PracticeQuestion[] {
  const pool = QUESTION_POOL[sessionType] ?? VOCABULARY_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
