import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface CodeAnalysis {
  suggestions: Array<{
    type: 'BUG' | 'PERFORMANCE' | 'SECURITY' | 'STYLE' | 'BEST_PRACTICE' | 'DOCUMENTATION';
    content: string;
    lineNumbers: number[];
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  summary: string;
  score: number;
}

export async function analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    // Return mock analysis if no API key is configured
    return getMockAnalysis(code, language);
  }

  try {
    const response = await openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert code reviewer. Analyze the provided ${language} code and provide:
1. Specific suggestions for improvements (bugs, performance, security, style, best practices, documentation)
2. Each suggestion should include: type, content, line numbers (estimate if not clear), and severity
3. A brief summary of the code quality
4. An overall quality score (0-100)

Respond in JSON format with this structure:
{
  "suggestions": [
    {
      "type": "BUG|PERFORMANCE|SECURITY|STYLE|BEST_PRACTICE|DOCUMENTATION",
      "content": "description of the issue",
      "lineNumbers": [1, 2, 3],
      "severity": "LOW|MEDIUM|HIGH|CRITICAL"
    }
  ],
  "summary": "brief summary",
  "score": 85
}`
        },
        {
          role: 'user',
          content: `Analyze this ${language} code:\n\n${code}`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('AI analysis error:', error);
    return getMockAnalysis(code, language);
  }
}

function getMockAnalysis(code: string, language: string): CodeAnalysis {
  const lines = code.split('\n').length;
  const suggestions: CodeAnalysis['suggestions'] = [];

  // Add some basic mock suggestions based on code length and language
  if (lines > 50) {
    suggestions.push({
      type: 'BEST_PRACTICE',
      content: 'Consider breaking this large function into smaller, more focused functions for better maintainability.',
      lineNumbers: [1, lines],
      severity: 'MEDIUM'
    });
  }

  if (!code.includes('try') && !code.includes('catch') && (language === 'javascript' || language === 'typescript')) {
    suggestions.push({
      type: 'BEST_PRACTICE',
      content: 'Consider adding error handling with try-catch blocks to make your code more robust.',
      lineNumbers: [1],
      severity: 'LOW'
    });
  }

  if (code.includes('console.log')) {
    suggestions.push({
      type: 'BEST_PRACTICE',
      content: 'Remove or replace console.log statements with proper logging in production code.',
      lineNumbers: code.split('\n').map((_, i) => i + 1).filter(i => code.split('\n')[i - 1]?.includes('console.log')),
      severity: 'LOW'
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'BEST_PRACTICE',
      content: 'Code looks good overall. Consider adding more comments to explain complex logic.',
      lineNumbers: [1],
      severity: 'LOW'
    });
  }

  return {
    suggestions,
    summary: 'Basic analysis completed. Configure OPENAI_API_KEY for advanced AI-powered code analysis.',
    score: 75
  };
}
