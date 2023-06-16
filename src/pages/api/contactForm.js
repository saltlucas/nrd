import sendgrid from "@sendgrid/mail";

// import.meta.env.SENDGRID_API_KEY
// import.meta.env.TO_EMAIL_ADDRESS
// import.meta.env.FROM_EMAIL_ADDRESS


export const post = async ({request}) => {
  // const data = await request;
  // console.log('data', data);
  // console.log('body', requestNew.body);
  // console.log(data.get('name'));
  // console.log('formData', formData);


  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    
    // error list of fields that have issues
    var errorFields = [];
    var isSendGridSuccess = false;
    var name = "";
    var email = "";
    var phone = "";
    var companyName = "";
    var companyWebsite = "";
    var budget = "";

    console.log('email raw', body.email);

    // Validate
    const nameRegex = /^[a-zA-Z ]{2,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const budgetRegex = /^[\d$A-Za-z\s\-,.]+$/;
    const domainRegex = /^(?!-)(https?:\/\/)?[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

    
    if(body.name && nameRegex.test(body.name)) {
      name = body.name.trim();
    } else {
      errorFields.push('name');
    }

    if(body.email && emailRegex.test(body.email)) {
      email = body.email;
      console.log('email', email);
    } else {
      console.error('error with email');
      errorFields.push('email');
    }

    if(body.phone && phoneRegex.test(body.phone)) {
      phone = body.phone;
    } else {
      console.error('phone number has an error');
      errorFields.push('phone');
    }

    if(body.companyName && nameRegex.test(body.companyName)) {
      companyName = body.companyName.trim();
    } else {
      console.error('companyName has an error');
      errorFields.push('companyName');
    }

    if(body.companyWebsite && domainRegex.test(body.companyWebsite)) {
      companyWebsite = body.companyWebsite;
    } else {
      console.error('companyWebsite has an error');
      errorFields.push('companyWebsite');
    }

    if(body.budget && budgetRegex.test(body.budget)) {
      budget = body.budget;
    } else {
      console.error('budget has an error');
      errorFields.push('budget');
    }
  }

  if(!errorFields.length) {
    // send with sendgrid
    sendgrid.setApiKey(import.meta.env.SENDGRID_API_KEY);
    const msg = {
      to: import.meta.env.TO_EMAIL_ADDRESS,
      from: { email: import.meta.env.FROM_EMAIL_ADDRESS, name: "NRD Form" },
      replyTo: email,
      subject: `NRD Form Submission: ${companyName}`,
      text: `
        NRD Form Submission
        Name: ${name}
        Email: ${email}
        Phone Number: ${phone}
        Company Name: ${companyName}
        Company Website: ${companyWebsite}
        Monthly Ad Spend: ${budget}  
      `,
    };
    try {
      await sendgrid.send(msg);
      console.log('email sent');
      isSendGridSuccess = true;

      return new Response(
        JSON.stringify({
          message: "Success!",
          body: { success: true }
        }),
        { status: 200 }
      );
      // Response is not defined
      //return callback(null, "Email sent!");
    } catch (error) {
      console.error(error);
      let { message } = error;
      if (error.response) {
        console.error(error.response.body);
        message = error.response.body.errors[0]; 
      }

      // response.setStatusCode(400);
      // response.setBody({ success: false, error: message });
      return new Response(
        JSON.stringify({
          message: "Error!",
          body: { success: false, error: message },
        }),
        { status: 400 }
      );
    }
  } else {
    return new Response(
      JSON.stringify({
        message: "Error!",
        errorFields,
        body: { success: false }
      }),
      { status: 400 }
    );
  }
}