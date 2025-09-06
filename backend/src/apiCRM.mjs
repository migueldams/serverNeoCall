import axios from "axios";
export default (app,ami)=>{ app.post('/originate', async (req, res) => {
  const { from, to } = req.body;

  ami.action({
    Action: 'Originate',
    Channel: `SIP/${from}`,
    Context: 'from-internal',
    Exten: to,
    Priority: 1,
    CallerID: `CRM-${from}`
  }, (err, response) => {
    if (err) {
      console.error("❌ Erreur Originate:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Appel lancé:", response);
    res.json(response);
  });
});

// 🚀 Ecoute des événements AMI
ami.on('managerevent', (event) => {
  if (event.event === "Newchannel") {
    console.log("📞 Nouvel appel:", event.CallerIDNum, "→", event.Exten);

    // Exemple : envoyer l’événement au CRM via webhook
    axios.post("http://ton-crm.local/api/call-events", {
      type: "new_call",
      from: event.CallerIDNum,
      to: event.Exten,
      uniqueid: event.Uniqueid
    }).catch(err => console.error("❌ Erreur envoi webhook:", err.message));
  }

  if (event.event === "Hangup") {
    console.log("🔚 Appel terminé:", event.CallerIDNum);

    axios.post("http://ton-crm.local/api/call-events", {
      type: "hangup",
      cause: event.CauseTxt,
      uniqueid: event.Uniqueid
    }).catch(err => console.error("❌ Erreur envoi webhook:", err.message));
  }
});

}