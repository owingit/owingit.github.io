//http://www.myphysicslab.com/dbl_pendulum.html

double dt;
double friction;
int counter = 0;
float r = 1;
float g = 1;
float b = 1;
int r_value = 0;
int g_value = 0;
int b_value = 0;
DoublePendulum pendulum;
DoublePendulum pendulum2;
DoublePendulum pupil_pendulum;
color white = color(255, 255, 255, 5);
color black = color(5, 5, 5, 65);
color brown = color(112,61,0,35);
color pink = color(255,192,203);
boolean recording = false;

function setup() {
  var canvasDiv = document.getElementById("myCanvas");
  var divWidth = document.getElementById("myCanvas").clientWidth;
  var sketchCanvas = createCanvas(divWidth,450);
  sketchCanvas.parent("myCanvas");
  frameRate(30);
  init();
}

function init() {
  dt = 0.00015;
  friction= -0.40;
  background(20);

  //center x, center y, length1, length2, mass1, mass2, angle1, angle2, angular velocity1, angular velocity 2, color
  pendulum = new DoublePendulum(width/2, height/2, 2, 2, 1.0, 1.0, radians(random(360)), radians(random(360)), 0.0, 0.0, /*color(r, g, b, 1), color(r, g, b, 1),*/ 9.81);
  
  pendulum2 = new DoublePendulum(width/2, height/2, 1, 1, 1.0, 1.0, radians(random(360)), radians(random(360)), 0.0, 0.0, /*color(255-r, 255-g, 255-b, 1), color(255-r, 255-g, 255-b, 1),*/ 9.81);
  
  pupil_pendulum = new DoublePendulum(width/2, height/2, 0.001, 0.65, 2.0, 2.0, radians(random(360)), radians(random(360)), 0.0, 0.0, /*color(r, g, b, 1), color(r, g, b, 1),*/ 9.81);
}


function draw() {
  for (int i=0; i<30; i++) { 
    color c2 = color(255-r, 255-g, 255-b, 1);
    pendulum.draw(pendulum.update(), pendulum.update());
    pendulum.update();
    
    
    //pendulum2.draw();
    //pendulum2.update();
    
    
    pupil_pendulum.draw_weighted(c2, c2);
    pupil_pendulum.update();
  }
  if (recording) {
    saveFrame("output/Pend_####.png");
  }
  //stroke(255,150);
  //ellipse(width/2, 300, 10, 10);
}

class DoublePendulum {
  double phi1, omega1, phi2, omega2;
  double mass1, mass2;
  double length1, length2;
  float x1, y1, x2, y2;
  float  cx, cy;
  double[] k1, l1, k2, l2;
  //color c, c2;
  double gc;

  DoublePendulum(float  cx, float  cy, double length1, double length2, double mass1, double mass2, double phi1, double phi2, double omega1, double omega2, /*color c, color c2,*/ double gc) {
    this.cx=cx;
    this.cy=cy;
    this.length1=length1;
    this.phi1=phi1;
    this.omega1=omega1;
    this.mass1=mass1;
    k1= new double[4];
    l1= new double[4];
    this.length2=length2;
    this.phi2=phi2;
    this.omega2=omega2;
    this.mass2=mass2;
    k2= new double[4];
    l2= new double[4];
    //this.c=c;
    //this.c2=c2;
    this.gc=gc;
  }

  double domega1(double phi1, double phi2, double omega1, double omega2) {
    return (-gc*(2*mass1+ mass2)*Math.sin(phi1)-mass2*gc*Math.sin(phi1-2*phi2)-2*Math.sin(phi1-phi2)*mass2*(omega2*omega2*length2+omega1*omega1*length1*Math.cos(phi1-phi2)) )/ (length1*( 2*mass1 + mass2 - mass2*Math.cos(2*phi1-2*phi2)))-(friction*omega1);
  }

  double domega2(double phi1, double phi2, double omega1, double omega2) {
    return 2*Math.sin(phi1-phi2)*(omega1*omega1*length1*(mass1+mass2)+gc*(mass1+mass2)*Math.cos(phi1)+omega2*omega2*length2*mass2*Math.cos(phi1-phi2))/ (length2*( 2*mass1 + mass2 - mass2*Math.cos(2*phi1-2*phi2)))-(friction*omega2);
  }

  color update() {//RK4
    k1[0] = dt*omega1;
    l1[0] = dt*domega1(phi1, phi2, omega1, omega2);
    k1[1] = dt*(omega1+l1[0]/2);
    l1[1] = dt*domega1(phi1+k1[0]/2, phi2, omega1+l1[0]/2, omega2);
    k1[2] = dt*(omega1+l1[1]/2);
    l1[2] = dt*domega1(phi1+k1[1]/2, phi2, omega1+l1[1]/2, omega2);
    k1[3] = dt*(omega1+l1[2]);
    l1[3] = dt*domega1(phi1+k1[2], phi2, omega1+l1[2], omega2);
    k2[0] = dt*omega2;
    l2[0] = dt*domega2(phi1, phi2, omega1, omega2);
    k2[1] = dt*(omega2+l2[0]/2);
    l2[1] = dt*domega2(phi1, phi2+k2[0]/2, omega1, omega2+l2[0]/2);
    k2[2] = dt*(omega2+l2[1]/2);
    l2[2] = dt*domega2(phi1, phi2+k2[1]/2, omega1, omega2+l2[1]/2);
    k2[3] = dt*(omega2+l2[2]);
    l2[3] = dt*domega2(phi1, phi2+k2[2], omega1, omega2+l2[2]);

    phi1 = phi1 + (k1[0]+2*k1[1]+2*k1[2]+k1[3])/6;
    omega1 = omega1 + (l1[0]+2*l1[1]+2*l1[2]+l1[3])/6;
    phi2 = phi2 + (k2[0]+2*k2[1]+2*k2[2]+k2[3])/6;
    omega2 = omega2 + (l2[0]+2*l2[1]+2*l2[2]+l2[3])/6;
    x1=(float)(cx+100*length1*Math.sin(phi1));
    y1=(float)(cy+100*length1*Math.cos(phi1));
    x2=(float)(x1+100*length2*Math.sin(phi2));
    y2=(float)(y1+100*length2*Math.cos(phi2));

    counter += 1;
    if (counter % 360 == 0) {
      r += random(10);
      g += random(40);
      b += random(70);
    }
    if (r > 255) {
      r_value = 510 - (int)r;
      if (r > 510) {
        r = 0;
        r_value = 0;
      }
    } else r_value = (int)r;
    if (g > 255) {
      g_value = 510 - (int)g;
      if (g > 510) {
        g = 0;
        g_value = 0;
      }
    } else g_value = (int)g;
    if (b > 255) {
      b_value = 510 - (int)b;
      if (b > 510) {
        b = 0;
        b_value = 0;
      }
    } else b_value = (int)b;
    
    color c = color(r_value, g_value, b_value, 10); 
    return c;
  }

  function draw(color c1, color c2) {
    stroke(c2);
    strokeWeight(0.5);
    line(cx, cy, (float)omega2, x1, y1, (-(float)omega1));
    stroke(c1);
    line(x1, y1, (float)omega1, x2, y2, (-(float)omega2));
    //fill(0);
    
    /*ellipse(x1, y1, (float)omega1, (float)omega2);
    fill(c);
    ellipse(x2, y2, 2, 2);
    fill(c);*/
  }
  
    function draw_weighted(color color_1, color color_2) {
    
    //line(cx, cy, (float)omega2, x1, y1, (-(float)omega1));
    //color c = color(((x1 % 255) / 255) * 120, ((y1 % 255) / 255) * 60, 0, 35);
    stroke(color_1,5);
    strokeWeight(5.0);
    line(cx, cy/*, (float)omega1*/, x1, y1/*,(-(float)omega2)*/);
    stroke(color_2, 95);
    strokeWeight(5.0);
    line(x1, y1, /*(float)omega1,*/ x2, y2/*,(-(float)omega2)*/);

    //fill(0);
  }
}

