import Container from "@material-ui/core/Container";
import React from "react";
import {GiraffeMarkdown} from "../components/GiraffeMarkdown";

const text = `
# Scientific Giraffe Privacy Policy

This privacy policy will explain how this website uses the personal data it collect from you when you use
it.

Topics:

* What data do we collect?
* How do we collect your data?
* How will we use your data?
* How do we store your data?
* Marketing
* What are your data protection rights?
* What are cookies?
* How do we use cookies?
* What types of cookies do we use?
* How to manage your cookies
* Privacy policies of other websites
* Changes to our privacy policy
* How to contact us
* How to contact the appropriate authorities

## What data do we collect?

This website collects the following data:

* Email address
* Facebook user details

## How do we collect your data?

You directly provide us with with most of the data we collect. We collect data and process data when you:

* Register online or place an order for any of our products or services.
* Log in using Facebook Connect
* Voluntarily complete a customer survey or provide feedback on any of our message boards or via email.
* Use or view our website via your browser’s cookies.

## How will we use your data?

This website collects your data so that we can:

* Email you if you ask us to send you notifications of new articles
* Check that you are a member of the appropriate Facebook group

We do not share your data with anybody else.

## How do we store your data?

All data is securely stored, and encrypted at rest where possible.

We will keep your data until you delete your account.

## Marketing

We do not send marketing emails

## What are your data protection rights?

We would like to make sure you are fully aware of all of your data protection rights. Every user is
entitled to the following:

**The right to access –** You have the right to request copies of your personal data. We may
charge you a small fee for this service.

**The right to rectification –** You have the right to request that we correct any information you
believe is inaccurate. You also have the right to request we complete the information you
believe is incomplete.

**The right to erasure –** You have the right to request that we erase your personal data, under
certain conditions.

**The right to restrict processing –** You have the right to request that we restrict the processing of
your personal data, under certain conditions.

**The right to object to processing –** You have the right to object to our processing of your
personal data, under certain conditions.

**The right to data portability –** You have the right to request that we transfer the data that we
have collected to another organization, or directly to you, under certain conditions.

If you make a request, we have one month to respond to you. If you would like to exercise any of these
rights, please contact us at our email: **privacy@giraffe.science**

## Cookies

Cookies are text files placed on your computer to collect standard Internet log information and visitor
behavior information. When you visit our websites, we may collect information from you automatically through
cookies or similar technology

For further information, visit https://allaboutcookies.org.

### How do we use cookies?

We use cookies in a range of ways to improve your experience on our website, including:

* Keeping you signed in
* Understanding how you use our website

### What types of cookies do we use?

There are a number of different types of cookies, however, our website uses:

**Functionality –** we use these cookies so that we recognize you on our website and remember your
previously selected preferences. These could include what language you prefer and location you are in. A mix
of first-party and third-party cookies are used.

### How to manage cookies

You can set your browser not to accept cookies, and the above website tells you how to remove cookies from
your browser. However, in a few cases, some of our website features may not function as a result.

## Privacy policies of other websites

The website contains links to other websites. Our privacy policy applies only to our website, so
if you click on a link to another website, you should read their privacy policy.

## Changes to our privacy policy

We keep this privacy policy under regular review and places any updates on this web page. This
privacy policy was last updated on 30 October 2020.

## How to contact us

If you have any questions about this privacy policy, the data we hold on you, or you would like to
exercise one of your data protection rights, please do not hesitate to contact us at **privacy@giraffe.science**.

## How to contact the appropriate authority

Should you wish to report a complaint or if you feel that we have not addressed your concern in a
satisfactory manner, you may contact the Information Commissioner’s Office.

https://ico.org.uk/global/contact-us/
`;

export function PrivacyPolicy() {
    return <Container>
        <GiraffeMarkdown>{text}</GiraffeMarkdown>
    </Container>
}
