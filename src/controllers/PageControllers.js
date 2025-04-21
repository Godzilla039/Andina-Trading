const mainView = (req, res)=>{
    res.render('home')
}

const tables = (req, res)=>{
    res.render('tables')
}

const notificationsUser = (req, res)=>{
    res.render('notifications')
}

module.exports = {
    mainView,
    tables,
    notificationsUser
}