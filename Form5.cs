using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TwinCAT.Ads;


namespace Wgrywanie_Oprogramowania_JH
{
    public partial class Form5 : Form
    {
        int z = 0;
        public int uchwyt;
        int ok = 0;
       
        public Form5()
        {
             
            InitializeComponent();
        }

        private void Button2_Click(object sender, EventArgs e)
        {
           
            this.Close();
        }

        private void Button1_Click(object sender, EventArgs e)
        {
            ok++;
            switch (ok)
            {
                case 1:
                    {

                        label1.Text = "postępujemy zgodnie z instrukcją na zdjęciu (zmieniamy IP adress oraz wpisujemy Default Gateway. Po wprowadzeniu przyciskamy guzik Apply następnie guzik ok) . Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.opt2;
                        checkBox1.BackColor = Color.Green;
                        checkBox2.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox1.CheckState = CheckState.Checked;
                        progressBar1.PerformStep(); break;
                    }
                case 2:
                    {

                        label1.Text = "Postępujemy zgodnie z instrukcją na zdjęciach. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.opt3;
                        checkBox2.BackColor = Color.Green;
                        checkBox3.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox2.CheckState = CheckState.Checked;
                        progressBar1.PerformStep(); break;
                    }
                case 3:
                    {

                        label1.Text = "Postępujemy zgodnie z instrukcją na zdjęciach. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.opt4;
                        checkBox3.BackColor = Color.Green;
                        checkBox4.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox3.CheckState = CheckState.Checked;
                        progressBar1.PerformStep(); break;
                    }
                case 4:
                    {

                        label1.Text = "Wszystko zostało zaprogramowane można przytąpić do testu Skrzyni";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.ok;
                        checkBox4.BackColor = Color.Green;
                        checkBox4.CheckState = CheckState.Checked;
                        button1.Text = "Przejście do głównego Menu";
                        progressBar1.PerformStep(); break;
                        
                    }
                case 5:
                    {
                        if (Application.OpenForms["Form1"] != null)
                        {
                            (Application.OpenForms["Form1"] as Form1).Raport(3, @"C:\Raporty JH\");
                        }
                        this.Close();break;

                    }
            }
            
        
            
        }

        private void Button3_Click(object sender, EventArgs e)
        {
            System.IO.Directory.CreateDirectory(@"..\..\test");//////ścieżka do beckhofa

        }
    }
}
