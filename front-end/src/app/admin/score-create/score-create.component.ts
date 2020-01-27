import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Score Create component, for creating and editing scores.
 */
@Component({
  selector: 'app-score-create',
  templateUrl: './score-create.component.html',
  styleUrls: ['./score-create.component.scss']
})
export class ScoreCreateComponent implements OnInit {
  /**Object for holding specific score definition. */
  score: any = {};
  /**Datasource for Mat-table in template. */
  dataSource = [];
  /**Switch for displaying form for score creation.*/
  showCreate = false;
  /**Switch for displaying table, true if datasource.length > 0*/
  showTable = false;
  /**Mat-tree variable name for column description. */
  displayCols = ['_id', 'header', 'description', 'edit']
  /**
   * @ignore
   * @param scoreService 
   * @param fb 
   * @param router 
   */
  constructor(
    private scoreService: ScoreService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  /**
   * OnInit livecyle hook Gets necessary data.
   */
  ngOnInit() {
    this.getScores();
  }

  /**
   * Function for getting all scores of authenticated user.
   */
  getScores() {
    this.scoreService.getAllScores().subscribe(
      (scores: any) => {
        this.dataSource = scores;
        this.showTable = true;
      },
      (error) => {
        console.error(error);
      }
    );
    this.showTable = true;
  }

  /**
   * OnClick listener function for showing edit form for existing score. 
   * @param score 
   */
  editScore(score) {
    this.score.data = score;
    this.score.form = this.fb.group({
      header: [score.header],
      description: [score.description],
      minValue: [score.minValue],
      maxValue: [score.maxValue]
    });
    this.showCreate = true;
  }

  /**
   * Onclick listener for setting form for new form creation.
   */
  newScore() {
    this.score.form = this.fb.group({
      header: [''],
      description: [''],
      maxValue: [0],
      minValue: [0],
    });
    this.showCreate = true;
  }

  /**
   * OnClick listener for saving created score.
   */
  saveScore() {
    this.showTable = false;
    let scoreData = this.score.form.value;
    if (this.score.data == undefined) {
      this.score.data = {};
      Object.assign(this.score.data, scoreData);
      this.scoreService.saveNewScore(this.score.data).subscribe(
        (score) => {
          this.dataSource.push(score);
          this.showCreate = false;
          this.showTable = true;
        }
      )
    } else {
      let ind = this.dataSource.findIndex(x => x._id == this.score.data._id);
      Object.assign(this.score.data, scoreData);
      this.scoreService.updateScoreInformation(this.score.data).subscribe(
        (score) => {
          this.dataSource[ind] = score;
          this.showCreate = false;
          this.showTable = true;
        }
      );
    }
  }
  /**
   * OnClick listener function for handling deleting a score.
   * @param element 
   */
  deleteScore(element) {
    this.showTable = false;
    let ind = this.dataSource.findIndex(x => x._id == element._id);
    if (ind == -1) {
      return;
    }
    this.scoreService.deleteScore(element._id).subscribe(
      () => {
        this.dataSource.splice(ind, 1);
        this.showTable = true;
      },
      (error) => {
        console.error(error);
      }
    )
  }
  /**@ignore */
  onBack() {
    this.router.navigate(['/admin']);
  }

}
