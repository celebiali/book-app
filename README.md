# Book App (Kütüphane Uygulaması)

Bu proje, kişisel bir kitap koleksiyonunu takip etmek amacıyla geliştirilmiş küçük bir Vue 3 tek sayfa uygulamasıdır. Uygulama örnek bir UI kitaplığı, Pinia ile durum yönetimi, Vue Router ile sayfa geçişleri ve modal tabanlı ekleme/güncelleme akışı içermektedir. Kitap verileri tarayıcıda localStorage üzerinde saklanır; kapak görselleri kullanıcı tarafından yüklenebilir ve tarayıcıda WebP'ye çevrilebilir.

## Özellikler

- Kitapları listeleme, filtreleme ve sayfalama
- Kitapları favorilere ekleme/çıkarma ve favoriler panelinde görüntüleme
- Yeni kitap ekleme (isteğe bağlı kapak görseli) — client-side WebP dönüştürmesi
- Kitap bilgilerini modal üzerinden güncelleme (Update)
- Kitap verilerinin localStorage ile kalıcı hale getirilmesi
- Duyarlı tasarım: masaüstü ve mobil gezinme (mobil menü)

## Teknolojiler
- Vue 3 (Composition API)
- Pinia (durum yönetimi)
- Vue Router 4
- Sass (SCSS) ile stiller
- Vitest ile birim testleri

## Geliştirme notları
- Uygulama kökü: `src/` klasörü.
- Bileşenler feature bazlı organize edilmiştir: `src/components/header`, `src/components/books`, `src/components/shared`, `src/components/icons`.
- Temel durum yönetimi Pinia ile `src/stores/` içinde yer alır:
  - `books.js` — kitap ekleme, güncelleme, silme, favori toggle ve localStorage persist işlemlerini içerir.
  - `ui.js` — modal açma/kapama, global success uyarıları ve mobil menü durumu.
- Modal diyalogları `BaseDialog.vue` yönetir. Hangi modalın açılacağını UI store'daki `dialogType` ve `dialogPayload` kontrol eder.
- Ekleme ve güncelleme formları:
  - `AddBookForm.vue` — yeni kitap ekleme formu (kapak yükleme, WebP dönüşümü).
  - `UpdateBookForm.vue` — seçili kitabın bilgilerini güncelleme.
- Varsayılan kapak görseli: `src/assets/img/book_img.png`.

## Önemli dosya / klasör yapısı
- `src/App.vue` — uygulama ana bileşeni, modal mount noktası
- `src/main.js` — uygulama başlatma (router, pinia bağlama)
- `src/components/books/` — kitap listesi, kart, favori paneli ve formlar
- `src/components/shared/` — ortak bileşenler (BaseInput, BaseButton, BaseDialog, SuccessAlert vb.)
- `src/stores/books.js` — uygulama mantığı için ana store

## Klasör yapısı
Kısa açıklamalarla proje içindeki ana klasörler:

- `public/` — Statik dosyalar ve `index.html` (uygulama giriş noktası).
- `src/` — Tüm uygulama kaynak kodu.
  - `src/main.js` — Uygulama başlangıç (router ve Pinia bağlama).
  - `src/App.vue` — Root bileşen; global layout ve modal mount noktası.
  - `src/assets/` — Görseller, SCSS değişkenleri ve stil yardımcıları.
  - `src/components/` — Bileşenler, alt klasörler feature bazlı (header, footer, books, shared, icons).
  - `src/components/books/` — Kitapla ilgili sayfa ve bileşenler (liste, kart, favoriler, formlar).
  - `src/components/shared/` — Tekrar kullanılabilir UI bileşenleri (BaseInput, BaseButton, BaseDialog vb.).
  - `src/components/icons/` — SVG ikon bileşenleri.
  - `src/pages/` — Uygulama sayfaları (BooksPage, AboutPage vb.).
  - `src/data/` — Örnek veri dosyaları (`books_full.json`).
  - `src/stores/` — Pinia store'lar (`books.js`, `ui.js`).

Bu bölüm, projeye yeni katkı sağlayanların hangi dosyayı nereye ekleyeceklerini hızla görmelerini sağlar.

## LocalStorage & Veri Yapısı
- Kitap verileri raw formatta `localStorage` içinde `bookapp.books.v1` anahtarında tutulur.
- Store içinde `raw` ve normalize edilmiş `books` (görüntüleme için) ayrımı yapılmıştır.
- Yeni kitap eklendiğinde id oluşturulur, güncelleme/silme işlemleri doğrudan store tarafından yönetilir.

## Styling / Tasarım
- SCSS değişkenleri `src/assets` altında yer alır; ortak renk ve boyut değişkenleri kullanılarak tasarım tutarlılığı sağlanmıştır.
- `BaseInput` ve `BaseButton` gibi bileşenler uygulama genelinde tekrar kullanılabilir, erişilebilir (a11y) ve duyarlı şekilde tasarlanmıştır.

### SCSS Dosyaları ve Kullanımı
Projede SCSS dosyaları modüler ve yeniden kullanılabilir olacak şekilde organize edilmiştir.

- `src/assets/main.scss` — Tüm SCSS giriş dosyası; Google font importları ve proje içi mixin / variable / base dosyalarını burada birleştirir. Uygulama root'ta bu dosya import edilir.
- `src/assets/variables/_variables.scss` — Tüm değişken setini (colors, sizes, fonts, break-points) tek dosyada birleştirir; diğer dosyalar bu dosyayı import eder.
- `src/assets/variables/_colors.scss` — Renk değişkenleri (ör. `$mainColor`, `$titleColor`, `$placeholderTextColor`) burada tanımlıdır. Tasarım renklerini burada güncellemek yeterlidir.
- `src/assets/variables/_sizes.scss` — Tipografi ve boyut değişkenleri (`$text-sm`, `$text-md`, vb.). Metin boyutları merkezi olarak yönetilir.
- `src/assets/variables/_fonts.scss` — Projede kullanılan font aileleri değişkenleri (`$font-family-inter`, `$font-family-futura`, vb.).
- `src/assets/variables/_break-points.scss` — Breakpoint tanımları (`$mobile`, `$tablet`, `$desktop`, `$large-desktop`) responsive mixin'lerde kullanılır.
- `src/assets/mixins/_mixins.scss` — Responsive mixin'leri içerir (`mobileView`, `desktopView`, `largeDesktopView`) — komponent stilinde `@include mobileView { ... }` şeklinde kullanılır.
- `src/assets/extends/_extends.scss` — Ortak %placeholder, örn `%container` gibi extend edilebilir bloklar içerir; layout grid/container özellikleri burada tanımlıdır.
- `src/assets/base/_base.scss` — Global base stiller: body reset, p tag reset, scrollbar stilleri vb. Temel normalize/utility stiller burada tanımlıdır.

Kullanım önerisi: yeni bir component SCSS dosyası oluşturduğunuzda, component scope içinde yalnızca gerekli sınıfları yazın; ortak renk, ölçü ve breakpoint ihtiyaçları için `main.scss` üzerinden import edilmiş değişken/mixin'leri kullanın.

## Test & Lint
- Testler `vitest` ile yazılmıştır. Testleri çalıştırmak için `npm run test`.
- Kodlama standartları için ESLint konfigürasyonu projede mevcuttur; `npm run lint` ile kontrol edin.

### tests/unit/books.spec.js dosyası (kısa açıklama)
Bu dosya `books` Pinia store'unun temel işlevselliğini doğrular. Öne çıkan noktalar:

- Node/Vitest ortamında çalışan bir `localStorage` polyfill'i içerir; böylece testler tarayıcı dışı ortamda da çalışır.
- Her testten önce `setActivePinia(createPinia())` ile temiz bir Pinia instance'ı oluşturulur ve `localStorage.clear()` ile veri sıfırlanır (izolasyon).
- Test edilen davranışlar:
  - `init()` çağrıldığında örnek verinin yüklendiğini doğrular.
  - `addBook()` ile kitap ekleme ve duplicate (çift) eklemeyi engelleme kontrolü.
  - `updateBook(id, changes)` işlevinin kaydı güncellediği doğrulanır.
  - `toggleFavoriteById(id, val)` sonrası `favorite` alanının değiştiği kontrol edilir.
  - `removeBookById(id)` ile silme işleminin başarılı olduğu doğrulanır.
  - `reloadFromStorage()` depolama yokken `false` döndürmelidir.

Çalıştırma: `npm run test` veya sürekli izleme için `npm run test:watch`.

Test eklerken dikkat: asenkron işlemler varsa `async/await` kullanın ve her testin izole olması için Pinia ve localStorage temizliğini sağlayın.

## Deployment

Uygulama Netlify üzerinde yayınlandı:

- Canlı Linki: https://book-app-reperi.netlify.app/


