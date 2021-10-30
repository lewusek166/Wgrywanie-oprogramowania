using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form1 : Form
    {
        int godz = 0;
        int min = 0;
        int sec = 0;
        int rezultatWgrywania = 0;
        string res;
        public Form1()
        {
            InitializeComponent();
            timer1.Start();
            
        }
        void Raport(string raport,int rezultat,string patch)
        {
            DateTime data = DateTime.Now;
            switch (rezultat)
            {
                case 0: res = "Przerwano Wgrywanie{0}"; break;
                case 1: res = "Beckhoff PASS {0}CVC FAILL {0}OPT FAILL"; break;
                case 2: res = "Beckhoff PASS {0}CVC FAILL {0}OPT PASS"; break;
                case 3: res = "Beckhoff PASS {0}CVC PASS {0}OPT PASS"; break;
            }
            raport =  ("Wgrywanie oprogramowania " +
                      "{0}" + "EKS215A " + 
                      "{0) --------------- " + 
                      "{0}" + data.ToLongDateString() + 
                      "{0} Operator : " + label2.Text.Substring(25, 4) + 
                      "{0} Czas pracy operatora : " + label3.Text + 
                      "{0} --------------------------" + "" +
                      "{0} REZULTAT " + 
                      "{0} "+ res +
                      "{0}--------------------------- ");
            

        }
        private void Button1_Click(object sender, EventArgs e)
        {
            rezultatWgrywania = 1;
            Form3 f3 = new Form3();
            f3.ShowDialog();
            
            button1.Enabled = false;
            button1.BackColor = System.Drawing.Color.Green;
            button2.Enabled = true;
        }
        public string GetTime()
        {
            string TimeInString = "";
            sec++;
            if (sec == 60)
            {
                min++;
                sec = 0;
            }
            if(min==60)
            {
                godz++;
                min = 0;
            }
            TimeInString = ((godz < 10) ? "0" + godz.ToString() : godz.ToString());
            TimeInString += ":"+((min < 10) ? "0" + min.ToString() : min.ToString());
            TimeInString += ":" + ((sec < 10) ? "0" + sec.ToString() : sec.ToString());
            return TimeInString;
        }
        private void Timer1_Tick(object sender, EventArgs e)
        {
            label3.Text = GetTime();
        }

        private void Button2_Click(object sender, EventArgs e)
        {
            rezultatWgrywania = 2;
            Form4 f4 = new Form4();
            f4.ShowDialog();
            button2.Enabled = false;
            button2.BackColor = System.Drawing.Color.Green;
            button3.Enabled = true;
        }

        private void Button3_Click(object sender, EventArgs e)
        {
            rezultatWgrywania = 3;
            Form5 f5 = new Form5();
            f5.ShowDialog();
            button3.Enabled = false;
            button3.BackColor = System.Drawing.Color.Green;
            button4.Enabled = true;
        }

        private void Button5_Click(object sender, EventArgs e)
        {

        }
    }
}
