import Comment from "../Models/CommentModel.js";

const getComments =  async (req, res) => {
    try{
        const { blog } = req.params;
        const user = req.userId;
        const commnets = await Comment.find({user, blog});
        res.json({commnets});
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

export {getComments}; 