import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pickle
import os

print("Tarım verileri simüle ediliyor...")

# Sentetik Veri Seti Oluşturma
np.random.seed(42)
n_samples = 500

# Özellikler (Features)
net_cashflow = np.random.normal(20000, 10000, n_samples)
milking_ratio = np.random.uniform(0.4, 0.8, n_samples)
disease_history = np.random.randint(0, 3, n_samples) # 0: yok, 1: az, 2: yüksek
herd_size = np.random.randint(20, 200, n_samples)

# Hedef Değişken (Gerçekçi Skor Hesaplama)
# Temel puan 500
y = 500 + (net_cashflow / 1000) * 5 + (milking_ratio * 200) - (disease_history * 50) + (herd_size * 0.5)

# Puanı 0-1000 arasına çek
y = np.clip(y, 0, 1000)

df = pd.DataFrame({
    'net_cashflow': net_cashflow,
    'milking_ratio': milking_ratio,
    'disease_history': disease_history,
    'herd_size': herd_size,
    'score': y
})

print("Veri Seti (İlk 5 Satır):")
print(df.head())

# Eğitim/Test Ayırımı
X = df[['net_cashflow', 'milking_ratio', 'disease_history', 'herd_size']]
y = df['score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nRandom Forest Modeli eğitiliyor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Model Başarısı (R^2 Skoru): {score:.4f}")

# Modeli Kaydet
os.makedirs('models', exist_ok=True)
with open('models/agriscore_rf_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("\nHarika! 'agriscore_rf_model.pkl' başarıyla kaydedildi.")
print("Artık FastAPI sunucusu bu eğitilmiş yapay zeka modelini kullanarak tahmin yapabilir!")
