import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SearchService} from '../../core/services/search.service';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})

export class AddItemComponent implements OnInit {

  modalRef: BsModalRef;  

  registerForm: FormGroup;

  submitted = false;

  new_item = {
    "id" : "",
    "taglines" : [      
    ],
    "kind" : "",
    "title" : ""
  }

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public searchService:SearchService) { }  
  
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      title: ['', Validators.required],
      kind: ['', Validators.required],
      taglines: ['', Validators.required],
    });

    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.controls[key].get;
    });


  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.new_item.id = this.new_item.title;
    var tagline = this.new_item.taglines;
    this.new_item.taglines = [tagline];

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    console.log(this.new_item);
    this.searchService.do_add(this.new_item);
    this.onReset();
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.modalRef.hide();
  }

  open_modal(template: TemplateRef<any>) {  
    this.modalRef = this.modalService.show(  
      template,  
      Object.assign({}, { class: 'gray modal-lg' })  
    );  
  } 

}
