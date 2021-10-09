using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Diagnostics;

namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form4 : Form
    {
        int etap;
        public Form4()
        {
            InitializeComponent();
            etap = 0;
        }

        private void Button1_Click_1(object sender, EventArgs e)
        {
            etap++;
            switch (etap)
            {
                case 1:
                    {
                        label1.Text = "Uruchom tester i naciśnik OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.pobrane;
                        checkBox1.BackColor = Color.Green;
                        checkBox2.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox1.CheckState = CheckState.Checked;
                        break;
                    }
                case 2:
                    {
                        label1.Text = "Przekręć kluczki na skrzyni tak jak na zdjęciu, następnie naciśnij OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.Folie8;
                        checkBox2.BackColor = Color.Green;
                        checkBox3.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox2.CheckState = CheckState.Checked;
                        break;
                    } 
                case 3:
                    {
                        label1.Text = "Podłącz przewód LAN z testera do skrzyni, następnie naciśnij OK ";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.Folie6;
                        checkBox3.BackColor = Color.Green;
                        checkBox4.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox3.CheckState = CheckState.Checked;
                        break;
                    }
                case 4:
                    {
                        label1.Text = "W okienku które nam się pojawiło klikamy Manuelle Signale";
                        Screen sc = new Screen();
                        sc.
                        Process.Start(@"C:\Users\plpha\Desktop\NavKitTester2\program\NavKitTester2.exe");
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.pobrane;
                        checkBox4.BackColor = Color.Green;
                        checkBox5.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox4.CheckState = CheckState.Checked;
                        break;
                    }
                case 5:
                    {
                        label1.Text = "Uruchom tester i naciśnik OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.pobrane;
                        checkBox4.BackColor = Color.Green;
                        checkBox5.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox4.CheckState = CheckState.Checked;
                        break;
                    }

            }
        }

        private void Button2_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
        
    
}
