const logoutController = {}

logoutController.logout = async(req, res)=> {
    res.clearCookie("authCookie")

    return res.status(200).json({message: "Cerrar Sesion"})
}

export default logoutController;