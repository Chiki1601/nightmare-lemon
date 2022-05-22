console.clear();

class Square
{
  constructor(container, i)
  {
    this.i = i;
    this.isEye = i % 2;
    this.opacity = i / 25 * .5;
    this.container = container;

    this.isClosed = true;

    this.colors = {
      iris: 'steelblue',
      dark: '#432B00',
      light: '#FCF8DA',
      lessLight: '#F8F1B3',
      upper: '#FFDE45',
      lower: '#FBD131' };


    this.groups = {};
    this.paths = {};

    ['outside', 'inside'].forEach(name => this.groups[name] = document.createElementNS("http://www.w3.org/2000/svg", "g"));
    ['lower', 'upper', 'upperTeeth', 'lowerTeeth'].forEach(name => {
      this.paths[name] = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.paths[name].setAttribute('d', 'M0,0,l0,0');
    });

    this.paths['back'] = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.paths['fade'] = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    this.paths.back.setAttribute('fill', this.isEye ? this.colors.light : this.colors.dark);
    this.paths.back.setAttribute('x', -1);
    this.paths.back.setAttribute('y', -1);

    this.paths.fade.setAttribute('fill', this.colors.dark);
    this.paths.fade.setAttribute('x', -1);
    this.paths.fade.setAttribute('y', -1);

    this.paths['iris'] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.paths['iris'].setAttribute('r', 0);
    this.paths['iris'].setAttribute('fill', this.colors.iris);

    this.paths['pupil'] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.paths['pupil'].setAttribute('fill', this.colors.dark);

    this.paths['upperTeeth'].setAttribute('fill', this.colors.light);
    this.paths['lowerTeeth'].setAttribute('fill', this.colors.lessLight);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    this.container.append(this.svg);

    gsap.set(this.paths.fade, { opacity: this.opacity });

    this.svg.append(this.paths.back);
    this.svg.append(this.groups.inside);
    this.svg.append(this.groups.outside);
    this.svg.append(this.paths.fade);

    this.groups.outside.append(this.paths.lower);
    this.groups.outside.append(this.paths.upper);

    this.paths.upper.setAttribute('fill', this.colors.upper);
    this.paths.lower.setAttribute('fill', this.colors.lower);

    if (this.isEye)
    {
      this.groups.inside.append(this.paths.iris);
      this.groups.inside.append(this.paths.pupil);
    } else

    {
      this.groups.inside.append(this.paths['upperTeeth']);
      this.groups.inside.append(this.paths['lowerTeeth']);
    }

    this.onResize();

    setTimeout(() => this.makeNewSquare(true), 0);
  }

  onResize()
  {
    this.width = this.container.clientWidth + 2;
    this.height = this.container.clientHeight + 2;
    this.svg.setAttribute("width", this.width);
    this.svg.setAttribute("height", this.height);

    this.paths.back.setAttribute('width', this.width);
    this.paths.back.setAttribute('height', this.height);
    this.paths.fade.setAttribute('width', this.width);
    this.paths.fade.setAttribute('height', this.height);

    const t = this.width / 8;
    this.paths['upperTeeth'].setAttribute('d', `M${t} ${t},L${this.width - t} ${this.height - t}, ${this.width + t * 2} ${this.height - t * 2}, ${this.width / 3} -${t} Z`);
    this.paths['lowerTeeth'].setAttribute('d', `M${t} ${t},L${this.width - t} ${this.height - t}, ${this.width - t * 2} ${this.height + t * 2}, -${t} ${this.height / 3} Z`);

    this.paths.iris.setAttribute('r', this.width / 3);
    this.paths.pupil.setAttribute('r', this.width / 4);
  }

  makeNewSquare(first = false)
  {
    this.onResize();

    if (Math.random() > (this.isClosed ? 0.2 : 0.9)) this.isClosed = !this.isClosed;

    let wh = this.width / 2 || 0;
    let hh = this.height / 2 || 0;

    if (this.isClosed)
    {
      gsap.to(this.paths.upper, { ease: 'power4', duration: first ? 0 : 0.4, morphSVG: `M-1,-1L${this.width} ${this.height}, ${this.width} -1Z` });
      gsap.to(this.paths.lower, { ease: 'power4', duration: first ? 0 : 0.4, morphSVG: `M-1,-1L${this.width} ${this.height}, -1 ${this.height}` });
    } else

    {
      gsap.to(this.paths.upper, { ease: 'power3', duration: first ? 0 : 0.7, morphSVG: `M-1,-1q${wh + Math.random() * wh} ${Math.random() * hh},${this.width} ${this.height}L${this.width} -1Z` });
      gsap.to(this.paths.lower, { ease: 'power3', duration: first ? 0 : 0.7, morphSVG: `M-1,-1q${0 + Math.random() * wh} ${Math.random() * this.height},${this.width} ${this.height}L-1 ${this.height}` });
    }

    const getEyePos = () => Math.random() * wh - wh / 2;

    let lowerTeethMove = 1 + Math.random() * (wh / 2);
    let upperTeethMove = 1 + Math.random() * (wh / 4);

    gsap.to(this.paths.lowerTeeth, { ease: 'power2', rotate: Math.random() * 6 - 3, duration: first ? 0 : 0.5, x: 0 - lowerTeethMove, y: lowerTeethMove });
    gsap.to(this.paths.upperTeeth, { ease: 'power2', rotate: Math.random() * 6 - 3, duration: first ? 0 : 0.5, x: upperTeethMove, y: 0 - upperTeethMove });
    gsap.to([this.paths.iris, this.paths.pupil], { ease: 'power4', duration: .6, x: wh + getEyePos(), y: hh + getEyePos() });

    setTimeout(() => this.makeNewSquare(), Math.random() * (this.isClosed ? 3000 : 1000));
  }}


const containers = Array.from(document.getElementsByClassName('container'));
containers.forEach((container, i) => new Square(container, i));