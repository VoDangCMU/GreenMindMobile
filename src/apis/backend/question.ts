import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export default async function getQuestions() {
  const res = await BackendInstance.get("/questions/survey", { headers: authHeader() });
  return res.data as IGetQuestionResponse;
}

export async function getQuestionsTemplateForAI() {
  const res = await BackendInstance.get(`/questions`, { headers: authHeader() });
  return res.data as IGetQuestionResponse;
}

const _dataChunk = {
  "id": "795cf308-7a30-4410-8752-28b3129b4c45",
  "question": "Người có tính cách N, độ tuổi 16, đánh giá hành động Tham gia cộng đồng hỗ trợ thanh thiếu niên trầm cảm theo mức độ thế nào?",
  "templateId": "T_RATING_03",
  "behaviorInput": "Đánh giá hành động 3",
  "behaviorNormalized": "rating",
  "template": {
    "id": "T_RATING_03",
    "name": "Đánh giá hành động 3",
    "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
    "intent": "rating",
    "question_type": "rating"
  },
  "options": [
    {
      "text": "Rất tệ",
      "value": "1",
      "order": 0
    },
    {
      "text": "Tệ",
      "value": "2",
      "order": 1
    },
    {
      "text": "Bình thường",
      "value": "3",
      "order": 2
    },
    {
      "text": "Tốt",
      "value": "4",
      "order": 3
    },
    {
      "text": "Rất tốt",
      "value": "5",
      "order": 4
    }
  ],
  "createdAt": "2025-11-09T14:41:36.988Z",
  "updatedAt": "2025-11-09T14:41:36.988Z"
}

const _actualResponse = {
  "message": "Survey questions retrieved successfully",
  "data": [
    {
      "id": "795cf308-7a30-4410-8752-28b3129b4c45",
      "question": "Người có tính cách N, độ tuổi 16, đánh giá hành động Tham gia cộng đồng hỗ trợ thanh thiếu niên trầm cảm theo mức độ thế nào?",
      "templateId": "T_RATING_03",
      "behaviorInput": "Đánh giá hành động 3",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_03",
        "name": "Đánh giá hành động 3",
        "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T14:41:36.988Z",
      "updatedAt": "2025-11-09T14:41:36.988Z"
    },
    {
      "id": "4cd4004e-b5c6-4859-bf0e-1ca985d22729",
      "question": "Người có tính cách O, giới tính Nam, độ tuổi 21, thường thực hiện hành động tham gia sự kiện nghệ thuật paris bao nhiêu lần?",
      "templateId": "T_FREQ_05",
      "behaviorInput": "Tần suất thực hiện hành động 5",
      "behaviorNormalized": "frequency",
      "template": {
        "id": "T_FREQ_05",
        "name": "Tần suất thực hiện hành động 5",
        "description": "Đánh giá mức độ lặp lại hành động theo độ tuổi và giới tính.",
        "intent": "frequency",
        "question_type": "frequency"
      },
      "options": [
        {
          "text": "Không bao giờ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Thỉnh thoảng",
          "value": "2",
          "order": 1
        },
        {
          "text": "Thường xuyên",
          "value": "3",
          "order": 2
        },
        {
          "text": "Rất thường xuyên",
          "value": "4",
          "order": 3
        }
      ],
      "createdAt": "2025-11-09T16:24:38.474Z",
      "updatedAt": "2025-11-09T16:24:38.474Z"
    },
    {
      "id": "ac2e0cd9-d696-4393-a1af-57e7b78bfc11",
      "question": "Người có tính cách C tại Paris đánh giá hành động lập kế hoạch tài chính cá nhân 20s Paris như thế nào?",
      "templateId": "T_RATING_06",
      "behaviorInput": "Đánh giá hành động 6",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_06",
        "name": "Đánh giá hành động 6",
        "description": "Đánh giá tổng quan hành động theo vị trí địa lý và tính cách.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:29:26.884Z",
      "updatedAt": "2025-11-09T16:29:26.884Z"
    },
    {
      "id": "71c038de-748e-4ef0-9594-3a8fb1f03637",
      "question": "Người purchasing behavior (hành vi mua sắm) có tính cách A, độ tuổi 20, mức độ thực hiện mua sắm trực tuyến đồ nam Hà Nội như thế nào?",
      "templateId": "T_FREQ_03",
      "behaviorInput": "Tần suất thực hiện hành động 3",
      "behaviorNormalized": "frequency",
      "template": {
        "id": "T_FREQ_03",
        "name": "Tần suất thực hiện hành động 3",
        "description": "Khảo sát mức độ thường xuyên hành động cụ thể.",
        "intent": "frequency",
        "question_type": "frequency"
      },
      "options": [
        {
          "text": "Không bao giờ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Thỉnh thoảng",
          "value": "2",
          "order": 1
        },
        {
          "text": "Thường xuyên",
          "value": "3",
          "order": 2
        },
        {
          "text": "Rất thường xuyên",
          "value": "4",
          "order": 3
        }
      ],
      "createdAt": "2025-11-09T14:27:31.121Z",
      "updatedAt": "2025-11-09T14:27:31.121Z"
    },
    {
      "id": "eae55a42-6e3d-444e-8cd8-6ad636df375b",
      "question": "Người có tính cách E, độ tuổi 18, đánh giá hành động tham gia câu lạc bộ thể thao HCM theo mức độ thế nào?",
      "templateId": "T_RATING_03",
      "behaviorInput": "Đánh giá hành động 3",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_03",
        "name": "Đánh giá hành động 3",
        "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T14:17:26.345Z",
      "updatedAt": "2025-11-09T14:17:26.345Z"
    },
    {
      "id": "53a88440-d5b2-4b4a-855f-2c93b393ec5e",
      "question": "Người có tính cách C, độ tuổi 67, đánh giá hành động lập kế hoạch tài chính hưu trí Hồ Chí Minh ở mức độ thế nào?",
      "templateId": "T_RATING_04",
      "behaviorInput": "Đánh giá hành động 4",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_04",
        "name": "Đánh giá hành động 4",
        "description": "Đánh giá hành động dựa trên trải nghiệm của người ở độ tuổi cụ thể.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T14:12:04.699Z",
      "updatedAt": "2025-11-09T14:12:04.699Z"
    },
    {
      "id": "c6ccccf7-ad97-4c6f-90b2-1b12710f83ee",
      "question": "Người có tính cách O, giới tính Nam, độ tuổi 56, yêu thích hành động Khám phá bảo tàng Paris đương đại ở mức nào?",
      "templateId": "T_LIKERT_01",
      "behaviorInput": "Mức độ yêu thích hành động 1",
      "behaviorNormalized": "likert5",
      "template": {
        "id": "T_LIKERT_01",
        "name": "Mức độ yêu thích hành động 1",
        "description": "Đánh giá mức độ yêu thích hành động cụ thể.",
        "intent": "likert5",
        "question_type": "likert5"
      },
      "options": [
        {
          "text": "Rất không thích",
          "value": "1",
          "order": 0
        },
        {
          "text": "Không thích",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Thích",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất thích",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:27:21.235Z",
      "updatedAt": "2025-11-09T16:27:21.235Z"
    },
    {
      "id": "c36b6956-b62c-4813-8a3b-595df0738a07",
      "question": "Người có tính cách C, giới tính Nữ, độ tuổi 42, mức độ yêu thích hành động tham gia khóa học quản lý tài chính cá nhân online là như thế nào?",
      "templateId": "T_FREQ_01",
      "behaviorInput": "Tần suất thực hiện hành động 1",
      "behaviorNormalized": "frequency",
      "template": {
        "id": "T_FREQ_01",
        "name": "Tần suất thực hiện hành động 1",
        "description": "Khảo sát tần suất người tham gia một hành động cụ thể.",
        "intent": "frequency",
        "question_type": "frequency"
      },
      "options": [
        {
          "text": "Không bao giờ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Thỉnh thoảng",
          "value": "2",
          "order": 1
        },
        {
          "text": "Thường xuyên",
          "value": "3",
          "order": 2
        },
        {
          "text": "Rất thường xuyên",
          "value": "4",
          "order": 3
        }
      ],
      "createdAt": "2025-11-09T15:14:58.096Z",
      "updatedAt": "2025-11-09T15:14:58.096Z"
    },
    {
      "id": "d48e618a-bd26-4371-acad-2c0766ba9846",
      "question": "Người có tính cách A, độ tuổi 24, cảm thấy mức độ yêu thích hành động So sánh giá điện máy khuyến mãi nam 24 tuổi như thế nào?",
      "templateId": "T_LIKERT_03",
      "behaviorInput": "Mức độ yêu thích hành động 3",
      "behaviorNormalized": "likert5",
      "template": {
        "id": "T_LIKERT_03",
        "name": "Mức độ yêu thích hành động 3",
        "description": "Đánh giá sự quan tâm hành động cụ thể.",
        "intent": "likert5",
        "question_type": "likert5"
      },
      "options": [
        {
          "text": "Rất không thích",
          "value": "1",
          "order": 0
        },
        {
          "text": "Không thích",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Thích",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất thích",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T14:27:07.970Z",
      "updatedAt": "2025-11-09T14:27:07.970Z"
    },
    {
      "id": "b1a0a3ce-f6dd-4b90-bd57-6f414316bc8a",
      "question": "Người có tính cách E, độ tuổi 39, đánh giá hành động tham gia câu lạc bộ thiện nguyện Tam Kỳ theo mức độ thế nào?",
      "templateId": "T_RATING_03",
      "behaviorInput": "Đánh giá hành động 3",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_03",
        "name": "Đánh giá hành động 3",
        "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T14:31:54.433Z",
      "updatedAt": "2025-11-09T14:31:54.433Z"
    },
    {
      "id": "21559751-f668-4126-a5b1-ee86c9826864",
      "question": "Người có tính cách E, độ tuổi 54, đánh giá hành động Câu Lạc Bộ Thơ Ca Huế U50 theo mức độ thế nào?",
      "templateId": "T_RATING_03",
      "behaviorInput": "Đánh giá hành động 3",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_03",
        "name": "Đánh giá hành động 3",
        "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T15:56:16.713Z",
      "updatedAt": "2025-11-09T15:56:16.713Z"
    },
    {
      "id": "79dfacae-e5ae-486d-94b9-9d82ae15df44",
      "question": "Người affective state (trạng thái cảm xúc), có tính cách N, độ tuổi 62, có thực hiện hành động thực phẩm chức năng an thần cho người lớn tuổi không?",
      "templateId": "T_YN_06",
      "behaviorInput": "Thói quen hành động 6",
      "behaviorNormalized": "yesno",
      "template": {
        "id": "T_YN_06",
        "name": "Thói quen hành động 6",
        "description": "Xác định khả năng người có hành vi cụ thể thực hiện hành động.",
        "intent": "yesno",
        "question_type": "yesno"
      },
      "options": [
        {
          "text": "Có",
          "value": "yes",
          "order": 0
        },
        {
          "text": "Không",
          "value": "no",
          "order": 1
        }
      ],
      "createdAt": "2025-11-09T14:45:36.708Z",
      "updatedAt": "2025-11-09T14:45:36.708Z"
    },
    {
      "id": "bbeb7297-6d86-4e61-8a29-5a623d602a6d",
      "question": "Người có tính cách E và độ tuổi 34 có thực hiện hành động Nhóm thiện nguyện Huế không?",
      "templateId": "T_YN_03",
      "behaviorInput": "Thói quen hành động 3",
      "behaviorNormalized": "yesno",
      "template": {
        "id": "T_YN_03",
        "name": "Thói quen hành động 3",
        "description": "Xác định xu hướng thực hiện hành động.",
        "intent": "yesno",
        "question_type": "yesno"
      },
      "options": [
        {
          "text": "Có",
          "value": "yes",
          "order": 0
        },
        {
          "text": "Không",
          "value": "no",
          "order": 1
        }
      ],
      "createdAt": "2025-11-09T15:47:20.683Z",
      "updatedAt": "2025-11-09T15:47:20.683Z"
    },
    {
      "id": "d7a4d653-1a7b-464d-8770-c7e264c83e18",
      "question": "Người có tính cách A, độ tuổi 35, đánh giá hành động So sánh giá quần áo nữ trung niên online ở mức độ thế nào?",
      "templateId": "T_RATING_04",
      "behaviorInput": "Đánh giá hành động 4",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_04",
        "name": "Đánh giá hành động 4",
        "description": "Đánh giá hành động dựa trên trải nghiệm của người ở độ tuổi cụ thể.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:00:12.517Z",
      "updatedAt": "2025-11-09T16:00:12.517Z"
    },
    {
      "id": "48dbe46a-307b-49cb-acea-5a0d46b714c1",
      "question": "Người goal setting behavior (hành vi đặt mục tiêu) có tính cách C, mức độ yêu thích lập kế hoạch tài chính cá nhân 20s Paris là như thế nào?",
      "templateId": "T_LIKERT_02",
      "behaviorInput": "Mức độ yêu thích hành động 2",
      "behaviorNormalized": "likert5",
      "template": {
        "id": "T_LIKERT_02",
        "name": "Mức độ yêu thích hành động 2",
        "description": "Đánh giá cảm xúc với hành động cụ thể.",
        "intent": "likert5",
        "question_type": "likert5"
      },
      "options": [
        {
          "text": "Rất không thích",
          "value": "1",
          "order": 0
        },
        {
          "text": "Không thích",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Thích",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất thích",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:29:26.444Z",
      "updatedAt": "2025-11-09T16:29:26.444Z"
    },
    {
      "id": "9c14fbb2-a84d-4696-a6c9-1ca2c10234e0",
      "question": "Người có tính cách C, độ tuổi 39, cảm thấy hứng thú với hành động Ứng dụng quản lý dự án cho phụ nữ 39+ ở mức nào?",
      "templateId": "T_LIKERT_06",
      "behaviorInput": "Mức độ yêu thích hành động 6",
      "behaviorNormalized": "likert5",
      "template": {
        "id": "T_LIKERT_06",
        "name": "Mức độ yêu thích hành động 6",
        "description": "Khảo sát sự hứng thú với hành động theo độ tuổi và tính cách.",
        "intent": "likert5",
        "question_type": "likert5"
      },
      "options": [
        {
          "text": "Rất không thích",
          "value": "1",
          "order": 0
        },
        {
          "text": "Không thích",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Thích",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất thích",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:30:22.151Z",
      "updatedAt": "2025-11-09T16:30:22.151Z"
    },
    {
      "id": "3705f0ad-31c3-450c-bc30-89fd81d3e810",
      "question": "Người có tính cách O, độ tuổi 32, cảm thấy hứng thú với hành động Tham gia workshop sáng tạo ở mức nào?",
      "templateId": "T_LIKERT_06",
      "behaviorInput": "Mức độ yêu thích hành động 6",
      "behaviorNormalized": "likert5",
      "template": {
        "id": "T_LIKERT_06",
        "name": "Mức độ yêu thích hành động 6",
        "description": "Khảo sát sự hứng thú với hành động theo độ tuổi và tính cách.",
        "intent": "likert5",
        "question_type": "likert5"
      },
      "options": [
        {
          "text": "Rất không thích",
          "value": "1",
          "order": 0
        },
        {
          "text": "Không thích",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Thích",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất thích",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T13:59:40.400Z",
      "updatedAt": "2025-11-09T13:59:40.400Z"
    },
    {
      "id": "dfae3293-547d-44a7-9f1b-39de9d80d829",
      "question": "Người có tính cách E và độ tuổi 52 có thực hiện hành động Giao lưu câu lạc bộ hưu trí Đà Nẵng không?",
      "templateId": "T_YN_03",
      "behaviorInput": "Thói quen hành động 3",
      "behaviorNormalized": "yesno",
      "template": {
        "id": "T_YN_03",
        "name": "Thói quen hành động 3",
        "description": "Xác định xu hướng thực hiện hành động.",
        "intent": "yesno",
        "question_type": "yesno"
      },
      "options": [
        {
          "text": "Có",
          "value": "yes",
          "order": 0
        },
        {
          "text": "Không",
          "value": "no",
          "order": 1
        }
      ],
      "createdAt": "2025-11-09T14:35:24.443Z",
      "updatedAt": "2025-11-09T14:35:24.443Z"
    },
    {
      "id": "32261114-51a8-4213-9c06-ea010a079753",
      "question": "Người có tính cách O, độ tuổi 61, đánh giá hành động Học vẽ tranh phong cảnh New York theo mức độ thế nào?",
      "templateId": "T_RATING_03",
      "behaviorInput": "Đánh giá hành động 3",
      "behaviorNormalized": "rating",
      "template": {
        "id": "T_RATING_03",
        "name": "Đánh giá hành động 3",
        "description": "Khảo sát đánh giá hành động cụ thể theo thang điểm.",
        "intent": "rating",
        "question_type": "rating"
      },
      "options": [
        {
          "text": "Rất tệ",
          "value": "1",
          "order": 0
        },
        {
          "text": "Tệ",
          "value": "2",
          "order": 1
        },
        {
          "text": "Bình thường",
          "value": "3",
          "order": 2
        },
        {
          "text": "Tốt",
          "value": "4",
          "order": 3
        },
        {
          "text": "Rất tốt",
          "value": "5",
          "order": 4
        }
      ],
      "createdAt": "2025-11-09T16:27:16.187Z",
      "updatedAt": "2025-11-09T16:27:16.187Z"
    },
    {
      "id": "972a4141-7c36-48ee-af81-c5956e1d507a",
      "question": "Người có tính cách E và độ tuổi 57 có thực hiện hành động Hội chị em U60 nấu ăn tại nhà không?",
      "templateId": "T_YN_03",
      "behaviorInput": "Thói quen hành động 3",
      "behaviorNormalized": "yesno",
      "template": {
        "id": "T_YN_03",
        "name": "Thói quen hành động 3",
        "description": "Xác định xu hướng thực hiện hành động.",
        "intent": "yesno",
        "question_type": "yesno"
      },
      "options": [
        {
          "text": "Có",
          "value": "yes",
          "order": 0
        },
        {
          "text": "Không",
          "value": "no",
          "order": 1
        }
      ],
      "createdAt": "2025-11-09T15:29:28.168Z",
      "updatedAt": "2025-11-09T15:29:28.168Z"
    }
  ],
  "count": 20,
  "userInfo": {
    "userId": "53f3d4a0-8af3-41ce-b407-c949c941601b",
    "location": "Da Nang, Vietnam",
    "age": 21,
    "filteredCount": 20,
    "validCount": 20,
    "randomCount": 0
  }
}