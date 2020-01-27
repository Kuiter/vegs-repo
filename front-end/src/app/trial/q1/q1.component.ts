import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
/**@ignore */
@Component({
  selector: 'app-q1',
  templateUrl: './q1.component.html',
  styleUrls: ['./q1.component.scss']
})
export class Q1Component implements OnInit {

  // personalInfo: FormGroup;
  infoForm: FormGroup;
  scale = new Array(7);

  iqUnderstandibilityFQ: FormGroup = this.fb.group({});
  iq = [
    {
      text: 'Mit Blick auf die Verständlichkeit, wie wichtig ist Ihnen, dass die Produktinformationen',
      subconstruct: [
        {
          "text": "... eindeutig sind.",
          "identifier": "expiq.01",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... einfach zu lesen sind.",
          "identifier": "expiq.02",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... leicht nachvollziehbar sind.",
          "identifier": "expiq.03",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... im generellen verständlich sind. ",
          "identifier": "expiq.04",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        }
      ]
    },
    {
      text: 'Mit Blick auf die Verlässlichkeit, wie wichtig ist Ihnen, dass die Produktinformationen...',
      subconstruct: [
        {
          "text": "... vertrauenswürdig sind.",
          "identifier": "expiq.05",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... präzise sind.",
          "identifier": "expiq.06",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... glaubwürdig sind.",
          "identifier": "expiq.07",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... im generellen zuverläsig sind. ",
          "identifier": "expiq.08",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
      ]
    },
    {
      text: 'Mit Blick auf die Nützlichkeit, wie wichtig ist es Ihnen, dass die Produktinformationen',
      subconstruct: [
        {
          "text": "... informativ für die Kaufentscheidung sind.",
          "identifier": "expiq.09",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... wertvoll für die Kaufentscheidung sind. ",
          "identifier": "expiq.10",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... im generellen, hilfreich für die Kaufentscheidung sind",
          "identifier": "expiq.11",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
      ]
    }
  ];

  sq = [
    {
      text: 'Wie wichtig ist Ihnen die Bedienbarkeit/Benutzbarkeit einer solchen Webseite im Bezug auf',
      subconstruct: [
        {
          "text": "... die Responsivität? (z.B. reagiert die Webseite schnell auf Eingaben?)",
          "identifier": "expsq.01",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die Performance? (z.B. schnelle Ladezeiten)",
          "identifier": "expsq.02",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die technologische Modernität im Allgemeinen?",
          "identifier": "expsq.03",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
      ]
    },
    {
      text: 'Wie wichtig ist Ihnen die Benutzerfreundlichkeit eines solchen Online Shops in Bezug auf',
      subconstruct: [
        {
          "text": "... ein simples Layout?",
          "identifier": "expsq.04",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... eine einfache Bedienung?",
          "identifier": "expsq.05",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... eine gute Organisation? (z.B. befinden sich die Bedienelemente des Shops da wo Sie es erwartet hätten?)",
          "identifier": "expsq.06",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die Möglichkeit, möglichst viele Produkte auf einen Blick sehen?",
          "identifier": "expsq.06.1",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die Möglichkeit, verschiedene Produkte leicht miteinander vergleichen können?",
          "identifier": "expsq.06.2",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die Verfügbarkeit von mehreren Produktbilder und Anzeigeformate (z.B. Zoom).",
          "identifier": "expsq.06.3",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... ein klares Design?",
          "identifier": "expsq.07",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... die Benutzerfreundlichkeit einer solchen Seite im Allgemeinen.",
          "identifier": "expsq.08",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        }
      ]
    },
    {
      text: 'Mit Blick auf Navigationsmöglichkeiten im Shop, wie wichtige ist Ihnen',
      subconstruct: [
        {
          "text": "... einfach und schnell zwischen den verschiedenen Seiten der Website hin- und zurück zu navigieren zu können.",
          "identifier": "expsq.09",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... mit wenigen Clicks zu den für Sie relevanten Informationen zu gelangen. ",
          "identifier": "expsq.10",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... möglichst schnell zu den von Ihnen präferierten Produkten zu gelangen.",
          "identifier": "expsq.10.1",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... schnell und unkompliziert meinen Warenkorb bearbeiten zu können (z.B. Produkte hinzufügen / entfernen).",
          "identifier": "expsq.10.2",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
        {
          "text": "... generell einfach zu navigieren.",
          "identifier": "expsq.11",
          "value": null,
          "scale": {
            "low": "völlig unwichtig",
            "high": "völlig wichtig"
          }
        },
      ]
    }
  ]


  iqReliabilityFG: FormGroup = this.fb.group({});
  iqReliability = [

  ]
  iqUsefulnessFG: FormGroup = this.fb.group({});
  iqUsefulness = [

  ];
  sqUsabilityFG: FormGroup = this.fb.group({});
  sqUsability = [

  ];
  sqUserfreindlinessFG: FormGroup = this.fb.group({});
  sqUserfreindliness = [

  ];

  sqNavigationFG: FormGroup = this.fb.group({});
  sqNavigation = [

  ];

  treatmentID = this.route.snapshot.params.treatmentID;
  subjectID = this.route.snapshot.params.subjectID;

  iqForm: FormGroup = this.fb.group({});
  sqForm: FormGroup = this.fb.group({});
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('q1') != undefined) {
      this.startTreatment();
    }
    [{iq: this.iq, form: this.iqForm}, {iq: this.sq, form: this.sqForm}].forEach((element, index) => {
      element.iq.forEach(construct => {
        construct.subconstruct.forEach(el => {
          element.form.addControl(el.identifier, new FormControl(el.value, Validators.required));
        })
      })
    })
  }

  async submitForm() {
    let questions1 = Object.assign({}, this.iqForm.value, this.sqForm.value)
    
    let questionnaire = {
      questions1
    };
    let resp = await this.http.put(`${environment.apiURI}/trial/questionnaire/${this.treatmentID}/${this.subjectID}`, questionnaire).toPromise();
    localStorage.setItem('q1', 'true');
  }

  startTreatment() {
    this.loading = true;
    this.router.navigate([`/t/${this.treatmentID}/s/${this.subjectID}/shop/products`]);
  }

  /**
   * generates unique identifier for radio button group
   * @param id 
   * @param index 
   */
  identifier(id, index): string {
    return `${id}${index}`;
  }
}
