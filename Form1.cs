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
        public Form1()
        {
            InitializeComponent();
            timer1.Start();
            
        }
        private void Button1_Click(object sender, EventArgs e)
        {
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
    }
}
