import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../trial-services/events.service';
/**@ignore */
@Component({
  selector: 'app-q2',
  templateUrl: './q2.component.html',
  styleUrls: ['../q1/q1.component.scss']
})
export class Q2Component implements OnInit {

  linear = true;
  scale = new Array(7);
  iqForm = this.fb.group({});
  iq = [
    {
      text: 'Bitte bewerten Sie die die Verständlichkeit der im Shop bereitgestellten Produktinformationen. Die im Shop zur Verfügung gestellten Produktinformationen waren generell',
      subconstruct: [
        {
          "text": "... eindeutig.",
          "identifier": "ppiq.01",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... einfach zu lesen.",
          "identifier": "ppiq.02",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... leicht nachvollziehbar.",
          "identifier": "ppiq.03",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... im generellen verständlich .",
          "identifier": "ppiq.04",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        }
      ]
    },
    {
      text: 'Mit Blick auf die Verlässlichkeit waren die Produktinformationen...',
      subconstruct: [
        {
          "text": "... vertrauenswürdig.",
          "identifier": "ppiq.05",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... präzise.",
          "identifier": "ppiq.06",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... glaubwürdig. ",
          "identifier": "ppiq.07",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... im generellen zuverläsig.",
          "identifier": "ppiq.08",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
      ]
    },
    {
      text: 'Die Produktinformationen waren',
      subconstruct: [
        {
          "text": "... informativ für meine Kaufentscheidung.",
          "identifier": "ppiq.09",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... wertvoll für meine Kaufentscheidung.",
          "identifier": "ppiq.10",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... im generellen, hilfreich für meine Kaufentscheidung.",
          "identifier": "ppiq.11",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
      ]
    }
  ]
  sqForm = this.fb.group({});
  sq = [
    {
      text: 'Mit Blick auf Bedienbarkeit/Benutzbarkeit des Online Shops, wie bewerten Sie',
      subconstruct: [
        {
          "text": "... die Responsivität (z.B. reagiert die Webseite schnell auf Eingaben).",
          "identifier": "ppsq.01",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... die Performance (z.B. schnelle Ladezeiten).",
          "identifier": "ppsq.02",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... die technologische Modernität im Allgemeinen.",
          "identifier": "ppsq.03",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
      ]
    },
    {
      text: 'Bitte bewerten Sie die Benutzerfreundlichkeit des Online Shops in Bezug auf',
      subconstruct: [
        {
          "text": "... ein simples Layout.",
          "identifier": "ppsq.04",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... eine einfach Bedienung.",
          "identifier": "ppsq.05",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... eine gute Organisation  (z.B. befinden sich die Bedienelemente des Shops da wo Sie es erwartet hätten.",
          "identifier": "ppsq.06",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... die Möglichkeit, möglichst viele Produkte auf einen Blick sehen.",
          "identifier": "ppsq.06.1",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... die Möglichkeit, verschiedene Produkte leicht miteinander vergleichen können.",
          "identifier": "ppsq.06.2",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... die Verfügbarkeit von mehreren Produktbilder und Anzeigeformate (z.B. Zoom).",
          "identifier": "ppsq.06.3",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": "... ein klares Design.",
          "identifier": "ppsq.07",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
        {
          "text": ".. die Benutzerfreundlichkeit einer solchen Seite im Allgemeinen.",
          "identifier": "ppsq.08",
          "value": null,
          scale: {
            low: 'sehr schlecht',
            high: 'sehr gut'
          }
        },
      ]
    },
    {
      text: 'Die Navigation auf der Seite hat es ermöglicht',
      subconstruct: [
        {
          "text": "... einfach und schnell zwischen den verschiedenen Seiten der Website hin- und zurück zu navigieren.",
          "identifier": "ppsq.09",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... mit wenigen Clicks zu den für mich relevanten Informationen zu gelangen.",
          "identifier": "ppsq.10",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... möglichst schnell zu den von mir präferierten Produkten zu gelangen.",
          "identifier": "ppsq.10.1",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... schnell und unkompliziert meinen Warenkorb bearbeiten zu können (z.B. Produkte hinzufügen / entfernen).",
          "identifier": "ppsq.10.2",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          "text": "... generell einfach zu navigieren.",
          "identifier": "ppsq.11",
          "value": null,
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
      ]
    }
  ]

  satForm = this.fb.group({});
  sat = [
    {
      text: 'Bitte bewerten Sie die folgenden Aussagen.', 
      subconstruct: [
        {
          text: 'Ich bin mit meinem Einkaufserlebnis in diesem Online-Supermarkt zufrieden.',
          identifier: 'satGen.01',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          text: 'Insgesamt sind meine Erwartungen an den Einkauf in diesem Online-Supermarkt erfüllt worden.',
          identifier: 'satGen.02',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          text: 'Ich würde Lebensmittel von einem echten Online-Supermarkt kaufen, der diesem Online-Supermarkt ähnlich ist.',
          identifier: 'satGen.03',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        }
      ]
    },
    {
      text: 'Bitte bewerten Sie die folgenden Aussagen.',
      subconstruct: [
        {
          text: 'Nachdem ich den Online Shop genutzt habe bin ich insgesamt...',
          identifier: 'satGen.04',
          value: null, 
          scale: {
            low: 'völlig unzufrieden',
            high: 'völlig zufrieden'
          }
        },
        {
          text: 'Nachdem ich den Online Shop genutzt habe bin ich insgesamt...',
          identifier: 'satGen.05',
          value: null, 
          scale: {
            low: 'völlig frustriert',
            high: 'völlig ermutigt'
          }
        },
        {
          text: 'Nachdem ich den Online Shop genutzt habe bin ich insgesamt...',
          identifier: 'satGen.06',
          value: null, 
          scale: {
            low: 'völlig enttäuscht',
            high: 'völlig erfreut'
          }
        },
        {
          text: 'Der Online Shop hat insgesamt einen ... Eindruck gemacht.',
          identifier: 'satGen.07',
          value: null, 
          scale: {
            low: 'sehr schlechten',
            high: 'sehr guten'
          }
        },
      ]
    },
    {
      text: 'Bitte teilen Sie uns mit, inwieweit Sie den folgenden Aussagen zustimmen.',
      subconstruct: [
        {
          text: 'Der aufbau der Webseite hat mit das Gefühl gegeben eine echten Web-Shop zu benutzen.',
          identifier: 'dmd.1',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          text: 'Die Produktauswahl und der Preis des von mir zusammengestellten Warenkorbs entspricht weitestgehend meinem regulären Einkaufsverhalten.',
          identifier: 'dmd.2',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          text: 'Die Entscheidungen, die ich getroffen habe, spiegeln genau wieder, wie ich mich bei einem regulären Einkauf verhalten würde (z.B. Produktvergleiche).',
          identifier: 'dmd.3',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
        {
          text: 'Die Informationen (z.B. Produktvergleiche), die ich mir während meines Einkaufs eingeholt habe, spiegeln mein Verhalten bei einem regulären Einkauf wieder.',
          identifier: 'dmd.4',
          value: null, 
          scale: {
            low: 'stimme gar nicht zu',
            high: 'stimme vollständig zu'
          }
        },
      ]
    }
  ]

  personalInfo: FormGroup;
  // iqUnderstandibilityFQ: FormGroup = this.fb.group({});
  // iqUnderstandibility = [
  //   {
  //     "text": "klar und einfach verständlich?",
  //     "identifier": "ppiq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "einfach zu lesen?",
  //     "identifier": "ppiq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen verständlich und hilfreich für die Kaufentscheidung?",
  //     "identifier": "ppiq.03",
  //     "value": null
  //   }
  // ];
  // iqReliabilityFG: FormGroup = this.fb.group({});
  // iqReliability = [
  //   {
  //     "text": "genau?",
  //     "identifier": "ppiq.04",
  //     "value": null
  //   },
  //   {
  //     "text": "glaubwürdig?",
  //     "identifier": "ppiq.05",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen zuverlässig für die Kaufentscheidung?",
  //     "identifier": "ppiq.06",
  //     "value": null
  //   },
  // ]
  // iqUsefulnessFG: FormGroup = this.fb.group({});
  // iqUsefulness = [
  //   {
  //     "text": "informativ für die Kaufentscheidung?",
  //     "identifier": "ppiq.07",
  //     "value": null
  //   },
  //   {
  //     "text": "wertvoll für die Kaufentscheidung?",
  //     "identifier": "ppiq.08",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen nützlich für die Kaufentscheidung?",
  //     "identifier": "ppiq.09",
  //     "value": null
  //   },
  // ];
  // sqUsabilityFG: FormGroup = this.fb.group({});
  // sqUsability = [
  //   {
  //     "text": "responsiven Eindruck?",
  //     "identifier": "ppsq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "performanten Eindruck?",
  //     "identifier": "ppsq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen wirkte die Seite technologisch modern?",
  //     "identifier": "ppsq.03",
  //     "value": null
  //   },
  // ];
  // sqUserfreindlinessFG: FormGroup = this.fb.group({});
  // sqUserfreindliness = [
  //   {
  //     "text": "ein simples Layout",
  //     "identifier": "ppsq.04",
  //     "value": null
  //   },
  //   {
  //     "text": "eine einfache Bedienung",
  //     "identifier": "ppsq.05",
  //     "value": null
  //   },
  //   {
  //     "text": "eine gute Organisation? (z.B. Befinden sich die Bedienelemente des Shops da wo Sie es erwartet hätten?)",
  //     "identifier": "ppsq.06",
  //     "value": null
  //   },
  //   {
  //     "text": "ein klares Design",
  //     "identifier": "ppsq.07",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Seite war im generellen Benutzerfreundlich?",
  //     "identifier": "ppsq.08",
  //     "value": null
  //   },
  // ];

  // sqNavigationFG: FormGroup = this.fb.group({});
  // sqNavigation = [
  //   {
  //     "text": "einfach hin und zurück zu finden?",
  //     "identifier": "ppsq.09",
  //     "value": null
  //   },
  //   {
  //     "text": "in wenigen Clicks zu den wichtigen Informationen zu gelangen?",
  //     "identifier": "ppsq.10",
  //     "value": null
  //   },
  //   {
  //     "text": "Es war im generellen einfach zu navigieren?",
  //     "identifier": "ppsq.11",
  //     "value": null
  //   },
  // ];

  // // disconfirmation question
  // disciqUnderstandibilityFQ: FormGroup = this.fb.group({});
  // disciqUnderstandibility = [
  //   {
  //     "text": "der Klarheit und Verständlichkeit?",
  //     "identifier": "disciq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "die Lesbarkeit?",
  //     "identifier": "disciq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Informationen waren im generellen Verständlichkeit und Nützlichkeit für die Kaufentscheidung?",
  //     "identifier": "disciq.03",
  //     "value": null
  //   }
  // ];
  // disciqReliabilityFG: FormGroup = this.fb.group({});
  // disciqReliability = [
  //   {
  //     "text": "der Genauigkeit?",
  //     "identifier": "disciq.04",
  //     "value": null
  //   },
  //   {
  //     "text": "der Glaubwürdigkeit?",
  //     "identifier": "disciq.05",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Informationen waren im generellen zuverlässig für die Kaufentscheidung?",
  //     "identifier": "disciq.06",
  //     "value": null
  //   },
  // ]
  // disciqUsefulnessFG: FormGroup = this.fb.group({});
  // disciqUsefulness = [
  //   {
  //     "text": "dem Informationsgrad für die Kaufentscheidung?",
  //     "identifier": "disciq.07",
  //     "value": null
  //   },
  //   {
  //     "text": "Infromationsgehalt für die Kaufentscheidung?",
  //     "identifier": "disciq.08",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Informationen waren im generellen nützlich für die Kaufentscheidung?",
  //     "identifier": "disciq.09",
  //     "value": null
  //   },
  // ];
  // discsqUsabilityFG: FormGroup = this.fb.group({});
  // discsqUsability = [
  //   {
  //     "text": "die Responsivität? (z.B. Reagiert die Webseite schnell auf Eingaben?)",
  //     "identifier": "discsq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "die Performance? (z.B. schnelle Ladezeiten)",
  //     "identifier": "discsq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen mit der technologisch Modernität?",
  //     "identifier": "discsq.03",
  //     "value": null
  //   },
  // ];
  // discsqUserfreindlinessFG: FormGroup = this.fb.group({});
  // discsqUserfreindliness = [
  //   {
  //     "text": "ein simples Layout?",
  //     "identifier": "discsq.04",
  //     "value": null
  //   },
  //   {
  //     "text": "eine einfache Bedienung?",
  //     "identifier": "discsq.05",
  //     "value": null
  //   },
  //   {
  //     "text": "eine gute Organisation? (z.B. Befinden sich die Bedienelemente des Shops da wo Sie es erwartet hätten?)",
  //     "identifier": "discsq.06",
  //     "value": null
  //   },
  //   {
  //     "text": "ein klares Design?",
  //     "identifier": "discsq.07",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen mit dem Gesamteindruck der Benutzerfreundlichkeit?",
  //     "identifier": "discsq.08",
  //     "value": null
  //   },
  // ];

  // discsqNavigationFG: FormGroup = this.fb.group({});
  // discsqNavigation = [
  //   {
  //     "text": "die Einfachheit hin und zurück zu finden?",
  //     "identifier": "discsq.09",
  //     "value": null
  //   },
  //   {
  //     "text": "eine geringe Click-Anzahl zu den wichtigen Informationen?",
  //     "identifier": "discsq.10",
  //     "value": null
  //   },
  //   {
  //     "text": "Im generellen mit der Navigation und Bedienung?",
  //     "identifier": "discsq.11",
  //     "value": null
  //   },
  // ];

  // satIQFG = this.fb.group({});
  // satIQ = [
  //   {
  //     "text": "Die Informationen die Sie erhalten haben waren für Sie:",
  //     "scale0": "völlig unzufrieden",
  //     "scale1": "sehr unzufrieden",
  //     "scale2": "ziemmlich unzufrieden",
  //     "scale3": "weder zufrieden noch unzufrieden",
  //     "scale4": "ziemlich zufrieden",
  //     "scale5": "sehr zufrieden",
  //     "scale6": "völlig zufirieden",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satiq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Informationen die Sie erhalten haben waren für Sie:",
  //     "scale0": "völlig frustriert",
  //     "scale1": "sehr frustriert",
  //     "scale2": "ziemmlich frustriert",
  //     "scale3": "weder ermutigt noch frustriert",
  //     "scale4": "ziemlich ermutigt",
  //     "scale5": "sehr ermutigt",
  //     "scale6": "völlig ermutigt",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satiq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Die Informationen die Sie erhalten haben waren für Sie:",
  //     "scale0": "völlig enttäuscht",
  //     "scale1": "sehr enttäuscht",
  //     "scale2": "ziemmlich enttäuscht",
  //     "scale3": "weder zufrieden noch enttäuscht",
  //     "scale4": "ziemlich erfreut",
  //     "scale5": "sehr erfreut",
  //     "scale6": "völlig erfreut",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satiq.03",
  //     "value": null
  //   },
  // ]
  // satSQFG = this.fb.group({});
  // satSQ = [
  //   {
  //     "text": "Im Zusammenhang mit den Funktionen und Features der Webseite die die Informationen abgebildet haben...",
  //     "scale0": "völlig unzufrieden",
  //     "scale1": "sehr unzufrieden",
  //     "scale2": "ziemmlich unzufrieden",
  //     "scale3": "weder zufrieden noch unzufrieden",
  //     "scale4": "ziemlich zufrieden",
  //     "scale5": "sehr zufrieden",
  //     "scale6": "völlig zufirieden",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satsq.01",
  //     "value": null
  //   },
  //   {
  //     "text": "Im Zusammenhang mit den Funktionen und Features der Webseite die die Informationen abgebildet haben...",
  //     "scale0": "völlig frustriert",
  //     "scale1": "sehr frustriert",
  //     "scale2": "ziemmlich frustriert",
  //     "scale3": "weder ermutigt noch frustriert",
  //     "scale4": "ziemlich ermutigt",
  //     "scale5": "sehr ermutigt",
  //     "scale6": "völlig ermutigt",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satsq.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Im Zusammenhang mit den Funktionen und Features der Webseite die die Informationen abgebildet haben",
  //     "scale0": "völlig enttäuscht",
  //     "scale1": "sehr enttäuscht",
  //     "scale2": "ziemmlich enttäuscht",
  //     "scale3": "weder zufrieden noch enttäuscht",
  //     "scale4": "ziemlich erfreut",
  //     "scale5": "sehr erfreut",
  //     "scale6": "völlig erfreut",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satsq.03",
  //     "value": null
  //   },
  // ]
  // satBothFG = this.fb.group({});
  // satBoth = [
  //   {
  //     "text": "Insgesamte Zufriedenheit in Bezug auf die Nutzung der Webseite",
  //     "scale0": "völlig unzufrieden",
  //     "scale1": "sehr unzufrieden",
  //     "scale2": "ziemmlich unzufrieden",
  //     "scale3": "weder zufrieden noch unzufrieden",
  //     "scale4": "ziemlich zufrieden",
  //     "scale5": "sehr zufrieden",
  //     "scale6": "völlig zufirieden",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satbth.01",
  //     "value": null
  //   },
  //   {
  //     "text": "Insgesamte Zufriedenheit in Bezug auf die Nutzung der Webseite",
  //     "scale0": "völlig frustriert",
  //     "scale1": "sehr frustriert",
  //     "scale2": "ziemmlich frustriert",
  //     "scale3": "weder ermutigt noch frustriert",
  //     "scale4": "ziemlich ermutigt",
  //     "scale5": "sehr ermutigt",
  //     "scale6": "völlig ermutigt",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satbth.02",
  //     "value": null
  //   },
  //   {
  //     "text": "Insgesamte Zufriedenheit in Bezug auf die Nutzung der Webseite",
  //     "scale0": "völlig enttäuscht",
  //     "scale1": "sehr enttäuscht",
  //     "scale2": "ziemmlich enttäuscht",
  //     "scale3": "weder zufrieden noch enttäuscht",
  //     "scale4": "ziemlich erfreut",
  //     "scale5": "sehr erfreut",
  //     "scale6": "völlig erfreut",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satbth.03",
  //     "value": null
  //   },
  //   {
  //     "text": "Insgesamte Zufriedenheit in Bezug auf die Nutzung der Webseite",
  //     "scale0": "völlig schlecht",
  //     "scale1": "sehr schlecht",
  //     "scale2": "ziemmlich schlecht",
  //     "scale3": "weder zufrieden noch schlecht",
  //     "scale4": "ziemlich gut",
  //     "scale5": "sehr gut",
  //     "scale6": "völlig gut",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satbth.04",
  //     "value": null
  //   },
  // ];

  // satGeneral = [
  //   {
  //     "text": "Der aufbau der Webseite hat mit das Gefühl gegeben eine echten Web-Shop zu benutzen",
  //     "scale0": "auf keinen Fall",
  //     "scale1": "eher nicht",
  //     "scale2": "ziemmlich wenig",
  //     "scale3": "weder noch",
  //     "scale4": "ziemlich",
  //     "scale5": "sehr",
  //     "scale6": "auf jeden Fall",
  //     "scale7": "Kann ich nicht sagen",
  //     "identifier": "satgeneral.01",
  //     "value": null
  //   },
  // ]
  // satGeneralFG = this.fb.group({});
  treatmentID = this.route.snapshot.params.treatmentID;
  subjectID = this.route.snapshot.params.subjectID;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private eventsService: EventsService) { }

  ngOnInit() {
    [{iq: this.iq, form: this.iqForm}, {iq: this.sq, form: this.sqForm}, {iq: this.sat, form: this.satForm}].forEach((element, index) => {
      element.iq.forEach(construct => {
        construct.subconstruct.forEach(el => {
          element.form.addControl(el.identifier, new FormControl(el.value, Validators.required));
        })
      })
    })
    this.satForm.addControl('dmd.5', new FormControl());

    // this.iqReliability.forEach(el => {
    //   this.iqReliabilityFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // });
    // this.iqUnderstandibility.forEach(el => {
    //   this.iqUnderstandibilityFQ.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.iqUsefulness.forEach(el => {
    //   this.iqUsefulnessFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.sqNavigation.forEach(el => {
    //   this.sqNavigationFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.sqUsability.forEach(el => {
    //   this.sqUsabilityFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.sqUserfreindliness.forEach(el => {
    //   this.sqUserfreindlinessFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.disciqReliability.forEach(el => {
    //   this.disciqReliabilityFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // });
    // this.disciqUnderstandibility.forEach(el => {
    //   this.disciqUnderstandibilityFQ.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.disciqUsefulness.forEach(el => {
    //   this.disciqUsefulnessFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.discsqNavigation.forEach(el => {
    //   this.discsqNavigationFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.discsqUsability.forEach(el => {
    //   this.discsqUsabilityFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.discsqUserfreindliness.forEach(el => {
    //   this.discsqUserfreindlinessFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.satIQ.forEach(el => {
    //   this.satIQFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.satSQ.forEach(el => {
    //   this.satSQFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.satBoth.forEach(el => {
    //   this.satBothFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })
    // this.satGeneral.forEach(el => {
    //   this.satGeneralFG.addControl(el.identifier, new FormControl(el.value, Validators.required));
    // })

    this.personalInfo = this.fb.group({
      age: [18, Validators.required],
      gender: ['none', Validators.required],
      occupation: ['none', Validators.required],
      education: ['none'],
      maritalStatus: ['none', Validators.required],
      housing: ['none', Validators.required],
      foodPurchaseResp: ['none', Validators.required],
      shoppingFrequency: [, Validators.required],
      income: [, Validators.required],
      expenditures: [, Validators.required],
      email: [, Validators.email]
    });
  }

  async submitPostTrial(stepper) {
    // submit
    let questions2 = Object.assign({}, this.iqForm.value, this.satForm.value, this.sqForm.value);
    const questionnaire = {
      personalInfo: this.personalInfo.value,
      questions2
    }
    let resp = await this.http.put(`${environment.apiURI}/trial/questionnaire/${this.treatmentID}/${this.subjectID}`, questionnaire).toPromise();
    const ended = await this.eventsService.endTrial().toPromise();
    localStorage.removeItem('q1');
    stepper.next();
  }

}
