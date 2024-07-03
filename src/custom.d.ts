import Express from "express"

declare global {
    namespace Express{
        interface Request {
            user_id: mongoose.Schema.Types.ObjectId;
            user_role: string;
        }
    }
}