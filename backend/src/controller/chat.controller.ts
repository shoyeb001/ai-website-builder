import { Response, Request } from "express";
import { chatSession } from "../services/aiModel.service";
import { BASE_PROMPT } from "../prompt";
import { basePrompt as reactBasePrompt } from "../default/react";

const chatController = {
    async getChat(req: Request, res: Response) {
        const { message } = req.body;
        try {
            const result = await chatSession.sendMessage(BASE_PROMPT + `Here is an artifact that contains all files of the project visible to you. Consider the contents of ALL files in the project.${reactBasePrompt} Here is a list of files that exist on the file system but are not being shown to you:  - .gitignore  - package-lock.json` + message);
            // console.log(result.response.text());
            res.status(200).json({ message: result.response.text() });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default chatController;