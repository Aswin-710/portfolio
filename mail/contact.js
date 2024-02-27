function sendEmail() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;
    let finalmessage = `Name : ${name} <br>  Email : ${email} <br>  Message : ${message} <br>`;
    Email.send({
        SecureToken : "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",
        To : 'aswinnkl710@gmail .com',
        From : email,
        Subject : subject,
        Body : finalmessage
    }).then(
      message => alert(message)
    );
}