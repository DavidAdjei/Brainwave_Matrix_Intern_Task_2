import Comment from "../Models/CommentModel.js";

const getUserComments =  async (req, res) => {
    try{
        const user = req.params.id;
        const comments = await Comment.find({user})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "firstName lastName email image _id username"
            });
        res.status(200).json({comments});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

export {getUserComments}; 