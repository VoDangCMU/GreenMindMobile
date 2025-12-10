import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";

// Hook để lấy tất cả dữ liệu survey
export function usePreAppSurveyData() {
  const store = usePreAppSurveyStore();
  
  return {
    // Dữ liệu câu trả lời
    answers: store.answers,
    
    // Trạng thái hoàn thành
    isCompleted: store.isCompleted,
    completedAt: store.completedAt,
    
    // Methods
    getSurveyData: store.getSurveyData,
    clearSurvey: store.clearSurvey,
    
    // Helper methods
    hasAnswered: (questionId: string) => {
      return store.answers && store.answers[questionId as keyof typeof store.answers];
    },
    
    getAnswer: (questionId: string) => {
      return store.answers?.[questionId as keyof typeof store.answers] || null;
    },
    
    // Export all data for debugging/analysis
    exportData: () => ({
      answers: store.answers,
      isCompleted: store.isCompleted,
      completedAt: store.completedAt,
    }),
  };
}

// Helper function để export dữ liệu ra ngoài component
export function getPreAppSurveyData() {
  return usePreAppSurveyStore.getState();
}