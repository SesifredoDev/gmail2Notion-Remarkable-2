const GMAIL_LABEL_NAME = 'SyncToNotion'; //label of the filtered emails
const SYNCED_LABEL = 'SyncedToNotion'; //label of the emails after this script is successful

const gmailToNotion = () => {
  const label = GmailApp.getUserLabelByName(GMAIL_LABEL_NAME);
  const successLabel = GmailApp.getUserLabelByName(SYNCED_LABEL);
  label.getThreads(0, 20).forEach((thread) => {
    const [message] = thread.getMessages().reverse();
    postToNotion(message);
    thread.removeLabel(label);
    thread.addLabel(successLabel)
  });
};


function postToNotion(message) {
  var folder = DriveApp.getFolderById('google drive folder id');
  const url = 'https://api.notion.com/v1/pages';
  const attachments = message.getAttachments()
  attachments.forEach((attachment)=>{
      
    const fileName = attachment.getName();
    

    var file = folder.createFile(attachment.copyBlob()).setName(fileName)
    const fileUrl = file.getUrl()
    var database = "database id 1" // default notion database

    if(message.getPlainBody().includes("check1")){ //checks if the message contains the string
      database = "database id 2"
    }
    if(message.getPlainBody().includes("check2")){ 
      database = "database id 3"
    }


    const body = {
      parent: {
        type: "database_id",
        database_id: database,
      },
      icon: {
        type: "emoji",
        emoji: "📝"
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: message.getPlainBody()
                },
              },
            ],
          },
        },
      ],
      properties: {
        Name: {
          title: [
            {
              text: {
                content: fileName
              },
            },
          ],
        },
      File: {
            "url": fileUrl
          }
      }
    }

    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: "application/json",
      muteHttpExceptions: false,
      headers: {
        Authorization: `Bearer secret_AAAAAAAAAAAAAA`, //Notion Intergration ID
        'Notion-Version': '2022-02-22'
      },
      payload: JSON.stringify(body)
    });
  })
  
}