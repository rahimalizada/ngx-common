import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlValidator } from './url-validator';

@Component({
  selector: 'lib-counter',
  template: `<form [formGroup]="form">
    <input name="input1" formControlName="input1" />
  </form>`,
})
export class TestComponent implements OnInit {
  form?: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      input1: [null, [UrlValidator.get]],
    });
  }
}

const validUrls = [
  'https://www2.hm.com/tr_tr/productpage.0570004009.html',
  'http://foo.com/blah_blah',
  'http://foo.com/blah_blah/',
  'http://foo.com/blah_blah_(wikipedia)',
  'http://foo.com/blah_blah_(wikipedia)_(again)',
  'http://www.example.com/wpstyle/?p=364',
  'https://www.example.com/foo/?bar=baz&inga=42&quux',
  'http://✪df.ws/123',
  'http://userid:password@example.com:8080',
  'http://userid:password@example.com:8080/',
  'http://userid@example.com',
  'http://userid@example.com/',
  'http://userid@example.com:8080',
  'http://userid@example.com:8080/',
  'http://userid:password@example.com',
  'http://userid:password@example.com/',
  'http://142.42.1.1/',
  'http://142.42.1.1:8080/',
  'http://➡.ws/䨹',
  'http://⌘.ws',
  'http://⌘.ws/',
  'http://foo.com/blah_(wikipedia)#cite-1',
  'http://foo.com/blah_(wikipedia)_blah#cite-1',
  'http://foo.com/unicode_(✪)_in_parens',
  'http://foo.com/(something)?after=parens',
  'http://☺.damowmow.com/',
  'http://code.google.com/events/#&product=browser',
  'http://j.mp',
  'ftp://foo.bar/baz',
  'http://foo.bar/?q=Test%20URL-encoded%20stuff',
  'http://مثال.إختبار',
  'http://例子.测试',
  'http://उदाहरण.परीक्षा',
  "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
  'http://1337.net',
  'http://a.b-c.de',
  'http://223.255.255.254',
  'https://foo_bar.example.com/',
];

const invalidUrls = [
  'http://',
  'http://.',
  'http://..',
  'http://../',
  'http://?',
  'http://??',
  'http://??/',
  'http://#',
  'http://##',
  'http://##/',
  'http://foo.bar?q=Spaces should be encoded',
  '//',
  '//a',
  '///a',
  '///',
  'http:///a',
  'foo.com',
  'rdar://1234',
  'h://test',
  'http:// shouldfail.com',
  ':// should fail',
  'http://foo.bar/foo(bar)baz quux',
  'ftps://foo.bar/',
  'http://-error-.invalid/',
  // 'http://a.b--c.de/',
  'http://-a.b.co',
  'http://a.b-.co',
  'http://0.0.0.0',
  'http://10.1.1.0',
  'http://10.1.1.255',
  'http://224.1.1.1',
  'http://1.1.1.1.1',
  'http://123.123.123',
  'http://3628126748',
  'http://.www.foo.bar/',
  // 'http://www.foo.bar./',
  'http://.www.foo.bar./',
  'http://10.1.1.1',
  'http://10.1.1.254',
];

describe('UrlValidator', () => {
  it('should create an instance', () => {
    expect(new UrlValidator()).toBeTruthy();
  });
});

describe('A form with UrlValidator component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [FormsModule, ReactiveFormsModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // This is not needed if you are in the CLI context
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  it('should be invalid if url is not valid', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: null });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val1' });
    expect(component.form?.valid).toBeFalsy();

    for (const url of invalidUrls) {
      component.form?.patchValue({ input1: url });
      if (component.form?.valid) {
        console.log(url);
      }
      expect(component.form?.valid).toBeFalsy();
    }
  });

  it('should be valid if url is  valid', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'http://domain.com' });
    expect(component.form?.valid).toBeTruthy();

    for (const url of validUrls) {
      component.form?.patchValue({ input1: url });
      if (!component.form?.valid) {
        console.log(url);
      }
      expect(component.form?.valid).toBeTruthy();
    }
  });
});
