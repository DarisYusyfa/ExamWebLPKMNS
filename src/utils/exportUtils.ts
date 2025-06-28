import { ExamResult } from '../types';

export const exportToCSV = (results: ExamResult[]): void => {
  const headers = [
    'Student Name',
    'Exam Type',
    'Score',
    'Total Questions',
    'Percentage',
    'Time Spent (minutes)',
    'Completed At',
    'Status'
  ];

  const rows = results.map(result => [
    result.studentName,
    result.examType.charAt(0).toUpperCase() + result.examType.slice(1),
    result.score.toString(),
    result.totalQuestions.toString(),
    ((result.score / result.totalQuestions) * 100).toFixed(1) + '%',
    Math.round(result.timeSpent / 60000).toString(),
    new Date(result.completedAt).toLocaleString(),
    result.score >= result.totalQuestions * 0.7 ? 'PASS' : 'FAIL'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `exam_results_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDetailedToCSV = (results: ExamResult[]): void => {
  const headers = [
    'Student Name',
    'Exam Type',
    'Question Character',
    'Selected Answer',
    'Correct Answer',
    'Is Correct',
    'Completed At'
  ];

  const rows: string[][] = [];
  
  results.forEach(result => {
    result.answers.forEach(answer => {
      rows.push([
        result.studentName,
        result.examType.charAt(0).toUpperCase() + result.examType.slice(1),
        answer.character,
        answer.selectedAnswer.toString(),
        answer.correctAnswer.toString(),
        answer.isCorrect ? 'YES' : 'NO',
        new Date(result.completedAt).toLocaleString()
      ]);
    });
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `detailed_exam_results_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};