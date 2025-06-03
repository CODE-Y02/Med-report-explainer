# This is diagram that explains how we can Achieve Summary generation via Ai by making sure process is HIPPA compliant .

`This Procedure has two part 1 Recommended Approach & 2 what i did in project including prompt.`

------

Few things to note:
1) Cloud Providers Like AWS offers Business Associate Agreement (BAA) to make sure their service is HIPPA compliant. I will assume we use one of those.
2) Best practice to auth user and take required consent at that time for all necessary things like privacy policy, T&C, data sharing, etc.
3) Additional Practice like: saving user info by masking onto db using combination of user based key + private key. 
    But this makes things difficult for ORM to read info so its better to just encrypt very critical info only.
4) Sometime files on s3 are venrable & we might want to encrypt it ( this is optional not needed when bucket is private).

-------
![image](https://github.com/user-attachments/assets/bf37c89c-df35-4560-ad02-d5ffe9c37c37)

-----

- How we achieve PHI removal & de-identification .
     - We need Text not document, We can either use any File to Text model or just use parser .
     - On huggingface I have seen few models for this or we can use lama 3 or other Open source models on our server to remove PHI. 
       This can also be achive by doing manually by code but it may not ne 100% accurate. 
       If use ai make sure temp is 0.1 so it genrate accurate result & provide strict prompt to generate it in fixed format without changing anything 
     - Once de-idenfication is done we can save it on db ( this to avaoid summary re-greneration for same file ).

- How to geneate summary
   - Use concisenes prompt
   - fiexd response format 
   - give negative prompt.
   - use gardrails to not leak any phi.
   - use verctor db to store records like termonologies , medicines samle diagnosis results etc and fine-tune model.

---------

What I am doing:
- I am mostly using simple free services so its not possibel to have complete HIPPA and PHI.
- I am making sure to remove all PHI via regex ( here i used code but taken ai help to generate code ).
- once PHI is removed I am passing it to model I am using openrouter misteral.
- I got generated text then retrun as respone.
- Settings I am using :
 ``` 
          model: AI_MODEL,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `You are a doctor explaining a medical report to a patient. 
              MOST IMPORTANT:.
                DO NOT INCLUDE ANY PHI.
                DO NOT INCLUDE ANY PHONE NUMBERS.
                DO NOT INCLUDE ANY ADDRESSES.
                DO NOT INCLUDE ANY EMAIL ADDRESSES.
                DO NOT INCLUDE ANY SOCIAL SECURITY NUMBERS.
                DO NOT INCLUDE ANY MEDICAL RECORD NUMBERS.
                DO NOT INCLUDE ANY HEALTH INSURANCE NUMBERS.
                DO NOT INCLUDE ANY REDACTED DATA.

              WHAT YOU NEED TO DO:
                Please read the provided report and explain what it means in simple, everyday language.
                Focus on the key findings and any recommended next steps.
                Be accurate and do not add any information not in the report.
                exclude any PHI as per HIPPA regulations.
               `,
            },
            {
              role: "system",
              content: `CONTEXT: heres the report data in raw format: 
              ${textContent} 
              `,
            },
            {
              role: "user",
              content: `Please explain this to me as if I were a patient. What does it say, and what should I do next?`,
            },
  ``` 

