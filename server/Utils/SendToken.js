//creating token and save in cookie

const SendToken = (user,statusCode =200,res)=>{
    const token = user.getJWTToken();
    if(!token) {
        return res.status(500).json({
            message: "Not authorized. Need to login.",
            success: false,
        })  //server error if token not generated or saved in cookie
    }
    //option for cookies
    const expireDetails={
        expires: new Date(
            Date.now() + process.env.Cookie_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    res.status(statusCode).cookie("token",token,expireDetails).json({
        success: true,
        user,
        token,
    })
}

module.exports = SendToken;