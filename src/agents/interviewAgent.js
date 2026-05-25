import { groqLLM } from '../api/groqClient';
import { extractJSON } from '../utils/jsonHelper';

export class InterviewAgent {
  constructor(type = "HR Interview", company = "Acme Corp", role = "Software Engineer", cvSummary = null, dsLevel = null, topicFocus = null) {
    this.type = type;
    this.company = company;
    this.role = role;
    this.cvSummary = cvSummary;
    this.dsLevel = dsLevel;
    this.topicFocus = topicFocus;
    this.questionNumber = 0;
    this.history = [];
  }

  async getNextResponse(userAnswer = null) {
    let systemPrompt;
    
    if (this.type === 'Data Science & Analytics') {
      systemPrompt = `You are a senior Data Science hiring manager at ${this.company} conducting a technical interview for a ${this.dsLevel || 'Mid Level / BA Level'} role. Ask questions strictly from these domains based on candidate level:

DOMAIN 1 — MATHS & STATISTICS
- Probability, Bayes Theorem, Conditional Probability
- Descriptive Statistics, Central Tendency, Variability
- Hypothesis Testing, Z-test, T-test, AB Testing
- Central Limit Theorem, Power Analysis
- Permutations and Combinations

DOMAIN 2 — DATA TOOLS
- Excel/Google Sheets: Pivot tables, VLOOKUP, What-if Analysis, Dashboarding
- SQL: Joins, Subqueries, Window Functions, Stored Procedures, Views, CTEs
- Power BI: DAX, Power Query, Data Modeling, RLS, Filter Context, M Query

DOMAIN 3 — PYTHON & EDA
- Python: OOPs, Lambda, Exception Handling, File Handling, List Comprehension
- EDA: Numpy, Pandas, Matplotlib, Seaborn, Plotly
- Web Scraping, Regex, API integration
- Probability Distributions, Sampling, Expected Value

DOMAIN 4 — MACHINE LEARNING
- Supervised: Linear Regression, Logistic Regression, KNN, Naive Bayes, SVM, Decision Trees, Ensemble Methods (Random Forest, XGBoost)
- Unsupervised: K-Means, DBSCAN, GMM, Hierarchical Clustering, Anomaly Detection, Dimensionality Reduction (PCA), Recommendation Systems
- Time Series: ARIMA models, Forecasting

DOMAIN 5 — ML OPS & DEPLOYMENT
- GitHub version control
- Streamlit app development
- Flask and FastAPI
- Docker and containerization
- Cloud deployment

DOMAIN 6 — DEEP LEARNING & NLP
- Neural Networks, MLP, Activation Functions
- TensorFlow and Keras, Callbacks
- RNN, LSTM
- NLP fundamentals
- Computer Vision basics

INTERVIEW RULES:
- Detect candidate level from their answers:
  * Beginner -> ask DA phase topics (Maths, SQL, Excel)
  * Intermediate -> ask BA phase topics (Python, EDA)
  * Advanced -> ask DS phase topics (ML, Deep Learning)
- Mix theoretical and practical questions
- Ask to explain real project experience
- Give coding challenge questions for Python/SQL
- Ask to interpret model results or metrics

STRICT RULES:
- Ask ONE question per turn
- After candidate answers, reply ONLY in this JSON:
{
  "scores": {
    "technicalAccuracy": number 1-10,
    "problemSolving": number 1-10,
    "communication": number 1-10,
    "realWorldApplication": number 1-10
  },
  "averageScore": number,
  "feedback": "max 2 sentences",
  "followUp": "one follow-up question based on their answer",
  "nextQuestion": "next main interview question or null",
  "questionNumber": number,
  "sessionComplete": boolean,
  "emotion": "Neutral" | "Happy" | "Calm"
}

After question 5 set sessionComplete true and add:
  "report": {
    "overallScore": number 1-10,
    "grade": "A" | "B" | "C" | "D",
    "hiringDecision": "Strong Yes" | "Yes" | "Maybe" | "No",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["area 1", "area 2"],
    "weakestArea": "Weakest technical area to study",
    "strongestArea": "Strongest technical area",
    "nextStudyTopics": ["topic 1", "topic 2"],
    "summary": "3 sentence overall assessment"
  }

Start with warm greeting and first question as plain text (no JSON for the opening message).`;
    } else {
      systemPrompt = `You are a senior hiring manager at ${this.company} interviewing for the role of ${this.role}. Conduct a professional mock interview.

STRICT RULES:
- Ask ONE question per turn
- After candidate answers, reply ONLY in this JSON:
{
  "scores": {
    "structure": number 1-10,
    "clarity": number 1-10,
    "confidence": number 1-10
  },
  "averageScore": number,
  "feedback": "max 2 sentences",
  "followUp": "one follow-up question based on their answer",
  "nextQuestion": "next main interview question or null",
  "questionNumber": number,
  "sessionComplete": boolean,
  "emotion": "Neutral" | "Happy" | "Calm"
}

After question 5 set sessionComplete true and add:
  "report": {
    "overallScore": number 1-10,
    "grade": "A" | "B" | "C" | "D",
    "hiringDecision": "Strong Yes" | "Yes" | "Maybe" | "No",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["area 1", "area 2", "area 3"],
    "summary": "3 sentence overall assessment"
  }

Start with warm greeting and first question as plain text (no JSON for the opening message).`;
    }

    if (this.topicFocus) {
      systemPrompt += `\n\nCRITICAL INSTRUCTION: The candidate explicitly wants this interview to focus purely on: ${this.topicFocus}. Do NOT ask questions outside of this topic. Tailor all technical and situational questions strictly to ${this.topicFocus}.`;
    }

    if (this.cvSummary) {
      if (this.type === 'Data Science & Analytics') {
        systemPrompt = `You are an expert Data Science interviewer. The candidate's CV summary:
${JSON.stringify(this.cvSummary)}

Conduct a deeply personalized Data Science interview:
- Detect DS skills from CV (Python, SQL, TensorFlow etc.)
- Map skills to curriculum domains
- Ask questions only from domains they claim to know
- Probe depth of each claimed skill
- Ask to explain real project experience
- Use the same JSON response format defined below
- Start by addressing them by name from their CV

${systemPrompt}`;
      } else {
        systemPrompt = `You are an expert interviewer. The candidate's CV summary:
${JSON.stringify(this.cvSummary)}

Conduct a deeply personalized interview:
- Reference their actual projects and experience by name
- Probe depth of their claimed skills with specific questions
- Ask about career transitions or gaps respectfully
- Challenge any vague claims with follow-up questions
- Use the same JSON response format as Interview Agent
- Start by addressing them by name from their CV
${systemPrompt}`;
      }
    }

    if (this.history.length === 0 && !userAnswer) {
      // First turn
      try {
        const response = await groqLLM(systemPrompt, "Start the interview.");
        this.history.push({ role: 'assistant', content: response });
        return { isOpening: true, text: response, emotion: 'Happy' };
      } catch (e) {
        return { isOpening: true, text: "Hello, let's begin the interview. Can you tell me about yourself?", emotion: 'Happy' };
      }
    } else {
      this.history.push({ role: 'user', content: userAnswer });
      this.questionNumber++;
      const userMessage = `My answer to question ${this.questionNumber}: "${userAnswer}"`;
      try {
        const response = await groqLLM(systemPrompt, this.history.map(h => `${h.role}: ${h.content}`).join('\n') + '\n' + userMessage, "llama-3.3-70b-versatile", true);
        const parsed = extractJSON(response);
        this.history.push({ role: 'assistant', content: response });
        return { isOpening: false, ...parsed };
      } catch (e) {
        console.error("InterviewAgent Error:", e);
        const fallbackScores = this.type === 'Data Science & Analytics' 
          ? { technicalAccuracy: 5, problemSolving: 5, communication: 5, realWorldApplication: 5 }
          : { structure: 5, clarity: 5, confidence: 5 };
          
        return {
          isOpening: false,
          scores: fallbackScores,
          averageScore: 5,
          feedback: "Good attempt, but could be clearer.",
          followUp: "Can you elaborate?",
          nextQuestion: "What is your greatest strength?",
          questionNumber: this.questionNumber,
          sessionComplete: this.questionNumber >= 5,
          emotion: "Neutral"
        };
      }
    }
  }
}
