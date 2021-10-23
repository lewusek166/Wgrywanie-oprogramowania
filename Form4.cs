﻿using System;
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
using System.Threading;
using System.IO;

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
                        label1.Text = "Uruchamiamy Tester: Przełączamy przełącznik na pozycję 1  Muszą zapalić się wszystkie diody sygnalizacyjne. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.testerOn;
                        checkBox1.BackColor = Color.Green;
                        checkBox2.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox1.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    }
                case 2:
                    {
                        label1.Text = "Przekręć kluczki na skrzyni tak jak na zdjęciu, następnie naciśnij OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.Folie8;
                        checkBox2.BackColor = Color.Green;
                        checkBox3.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox2.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    } 
                case 3:
                    {
                        label1.Text = "Podłącz przewód LAN z testera do skrzyni, następnie naciśnij OK ";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.Folie6;
                        checkBox3.BackColor = Color.Green;
                        checkBox4.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox3.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    }
                
                case 4:
                    {
                        label1.Text = "W okienku które nam się pojawiło klikamy Manuelle Signale oraz przeciągamy okno na drógi monitor i maksymalizujemy aby ułatwić sobie pracę. Następnie klikamy OK";
                        Process.Start(@"C:\Users\plpha\Desktop\NavKitTester2\program\NavKitTester2.exe");
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.manual;
                        break;
                    }
                case 5:
                    {
                        label1.Text = "Klikamy na przycisk tak jak na zdjęciu i czekamy aż zapali się na zielono. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.manual2_3;
                        break;
                    }
                case 6:
                    {
                        label1.Text = "Kułeczkiem na myszce zjeżdzamy na dół, aż do pozycji które są podkreślone na zielono na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.manual3_4;
                        break;
                    }
                case 7:
                    {
                        label1.Text = "Klikamy na 3 pozycję zaznaczone na zdjęciu. Muszą zaplaić się na zielono. Uwaga nie przestrasz sie ponieważ uruchomi się skrzynia testowana. Następnie zamykamy 'X' tak jak na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.manual4;
                        checkBox4.BackColor = Color.Green;
                        checkBox5.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox4.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    }
                case 8:
                    {
                        label1.Text = " Na testerze muszą zapalić się 3 diody. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.diodyTester;
                        checkBox5.BackColor = Color.Green;
                        checkBox6.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox5.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    }
                case 9:
                    {
                        Process.Start("https://192.168.100.100");
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_1;
                        label1.Text = "Uruchomila sie strona, przeciągamy przeglądarke internetową na drógi monitor aby ułatwić sobie pracę. Czy zgadza się z zdjęciem ?. Jeśli tak klikamy OK";
                        checkBox6.BackColor = Color.Green;
                        checkBox7.BackColor = Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
                        checkBox6.CheckState = CheckState.Checked;
                        progressBar1.PerformStep();
                        break;
                    }
                case 10:
                    {
                        label1.Text = "Klikamy na przycisk 'wybierz plik' zaznaczymy odpowiedni plik i klikamy 'otwórz' następnie kikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_2_3;
                        break;
                    }
                case 11:
                    {
                        label1.Text = "Klikamy przycisk 'install'. Następnie Klikamy OK ";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_33;
                        break;
                    }
                case 12:
                    {
                        label1.Text = "Czekamy aż zakończy się wgrywanie danch. Po jego zakończeniu powinna otorzyć się strona taka jak na zdjęciu. Jeśli wszystko się zgadza kilkamy OK ";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_7;
                        break;
                    }
                case 13:
                    {
                        label1.Text = "Klikamy na przycisk 'change password' następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_6;
                        break;
                    }
                case 14:
                    {
                        label1.Text = "Wykonujemy wszystko tak jak na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_9;
                        break;
                    }
                case 15:
                    {
                        label1.Text = "Wykonujemy wszystko tak jak na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_10;
                        break;
                    }
                case 16:
                    {
                        label1.Text = "Porównujemy zdjęcie z stroną interenetową jeżeli wszystko się zgadza klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_11;
                        break;
                    }
                case 17:
                    {
                        label1.Text = "Wykonujemy wszystko tak jak na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_12;
                        break;
                    }
                case 18:
                    {
                        label1.Text = "Wykonujemy wszystko tak jak na zdjęciu. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_13;
                        break;
                    }
                case 19:
                    {
                        label1.Text = "Klikamy w guzik 'wybierz plik'. Wybieramy odpowiedni plik. Klikamy Otwórz. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc__14;
                        break;
                    }
                case 20:
                    {
                        label1.Text = "Klikamy w guzik 'Restore'. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_15;
                        break;
                    }
                case 21:
                    {
                        label1.Text = "Sprawdzamy czy strona internetowa zgadza się ze zdjęciem'. Następnie klikamy OK";
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_16;
                        break;
                    }
                case 22:
                    {
                        label1.Text = "Otworzyła się następna strona interentowa sprawdzamy czy zgadza się ze zdjęciem'. Następnie klikamy OK";
                        Process.Start("http://192.168.100.100/cgi-bin/login.cgi?request=/cgi-bin/backupfile.cgi");
                        pictureBox1.Image = global::Wgrywanie_Oprogramowania_JH.Properties.Resources.cvc_15;
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
