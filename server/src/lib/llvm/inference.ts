import { config } from "@config";
import { textGenerationStream, questionAnswering } from "@huggingface/inference";

const ACCESS_TOKEN = config.env.HUGGING_FACE_ACCESS_TOKEN;

export default {
    answerQuestion: async (question: string, context: string = "") => {
        return questionAnswering({
            accessToken: ACCESS_TOKEN,
            inputs: {
                question,
                context
            }
        });
    },
    chatStream: async (prompt: string) => {
        return textGenerationStream({
            model: "openchat/openchat-3.5-0106",
            inputs: prompt,
            parameters: {}
        });
    }
}
